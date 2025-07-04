//! AVM2 classes

use crate::avm2::activation::Activation;
use crate::avm2::error::{make_error_1014, make_error_1053, verify_error, Error1014Type};
use crate::avm2::method::{Method, NativeMethodImpl};
use crate::avm2::object::{scriptobject_allocator, ClassObject, Object};
use crate::avm2::script::TranslationUnit;
use crate::avm2::traits::{Trait, TraitKind};
use crate::avm2::value::Value;
use crate::avm2::vtable::VTable;
use crate::avm2::Error;
use crate::avm2::Multiname;
use crate::avm2::Namespace;
use crate::avm2::QName;
use crate::context::UpdateContext;
use crate::string::{AvmString, WString};
use bitflags::bitflags;
use fnv::FnvHashMap;
use gc_arena::{Collect, GcCell, Mutation};

use std::cell::Ref;
use std::collections::HashSet;
use std::fmt;
use std::hash::{Hash, Hasher};

use swf::avm2::types::{Method as AbcMethod, MethodBody as AbcMethodBody};

bitflags! {
    /// All possible attributes for a given class.
    #[derive(Clone, Copy)]
    pub struct ClassAttributes: u8 {
        /// Class is sealed, attempts to set or init dynamic properties on an
        /// object will generate a runtime error.
        const SEALED    = 1 << 0;

        /// Class is final, attempts to construct child classes from it will
        /// generate a verification error.
        const FINAL     = 1 << 1;

        /// Class is an interface.
        const INTERFACE = 1 << 2;

        /// Class accepts type parameters.
        const GENERIC = 1 << 3;
    }
}

/// A function that can be used to allocate instances of a class.
///
/// By default, the `implicit_allocator` is used, which attempts to use the base
/// class's allocator, and defaults to `ScriptObject` otherwise. Custom
/// allocators anywhere in the class inheritance chain can change the
/// representation of all subclasses that use the implicit allocator.
///
/// Parameters for the allocator are:
///
///  * `class` - The class object that is being allocated. This must be the
///    current class (using a superclass will cause the wrong class to be
///    read for traits).
///  * `activation` - The current AVM2 activation.
pub type AllocatorFn =
    for<'gc> fn(ClassObject<'gc>, &mut Activation<'_, 'gc>) -> Result<Object<'gc>, Error<'gc>>;

#[derive(Clone, Copy)]
pub struct Allocator(pub AllocatorFn);

/// A function that can be used to both allocate and construct an instance of a class.
///
/// This function should be passed an Activation, and the arguments passed to the
/// constructor, and will return an Object.
pub type CustomConstructorFn =
    for<'gc> fn(&mut Activation<'_, 'gc>, &[Value<'gc>]) -> Result<Value<'gc>, Error<'gc>>;

#[derive(Clone, Copy)]
pub struct CustomConstructor(pub CustomConstructorFn);

impl fmt::Debug for Allocator {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_tuple("Allocator")
            .field(&"<native code>".to_string())
            .finish()
    }
}

#[derive(Clone, Collect)]
#[collect(no_drop)]
enum ClassLink<'gc> {
    Unlinked,
    LinkToInstance(Class<'gc>),
    LinkToClass(Class<'gc>),
}

#[derive(Collect, Clone, Copy)]
#[collect(no_drop)]
pub struct Class<'gc>(pub GcCell<'gc, ClassData<'gc>>);

/// A loaded ABC Class which can be used to construct objects with.
#[derive(Clone, Collect)]
#[collect(no_drop)]
pub struct ClassData<'gc> {
    /// The name of the class.
    name: QName<'gc>,

    /// The type parameter for this class (only supported for Vector)
    param: Option<Option<Class<'gc>>>,

    /// This class's superclass, or None if it has no superclass
    super_class: Option<Class<'gc>>,

    /// Attributes of the given class.
    #[collect(require_static)]
    attributes: ClassAttributes,

    /// The namespace that protected traits of this class are stored into.
    protected_namespace: Option<Namespace<'gc>>,

    /// The list of interfaces this class directly implements. This does not include any
    /// superinterfaces, nor interfaces implemented by the superclass.
    direct_interfaces: Vec<Class<'gc>>,

    /// Interfaces implemented by this class, including interfaces
    /// from parent classes and superinterfaces (recursively).
    /// TODO - avoid cloning this when a subclass implements the
    /// same interface as its superclass.
    all_interfaces: Vec<Class<'gc>>,

    /// The instance allocator for this class. Defaults to the script object allocator
    /// if no allocator is provided.
    #[collect(require_static)]
    instance_allocator: Allocator,

    /// The instance initializer for this class, None if this class is not
    /// instantiable.
    ///
    /// Must be called each time a new class instance is constructed.
    instance_init: Option<Method<'gc>>,

    /// Traits for a given class.
    ///
    /// These are accessed as normal instance properties; they should not be
    /// present on prototypes, but instead should shadow any prototype
    /// properties that would match.
    traits: Vec<Trait<'gc>>,

    vtable: VTable<'gc>,

    /// The customization point for `Class(args...)` without `new`
    /// If None, a simple coercion is done.
    #[collect(require_static)]
    call_handler: Option<NativeMethodImpl>,

    /// The custom constructor for this class, if it exists.
    ///
    /// This function will both allocate and initialize the class.
    #[collect(require_static)]
    custom_constructor: Option<CustomConstructor>,

    /// Whether or not this `Class` has loaded its traits or not.
    traits_loaded: bool,

    /// Maps a type parameter to the application of this class with that parameter.
    ///
    /// Only applicable if this class is generic.
    applications: FnvHashMap<Option<Class<'gc>>, Class<'gc>>,

    /// The Class this Class is linked to. If this class represents instance info,
    /// this will be a ClassLink::LinkToClass. If this class represents class info,
    /// this will be a ClassLink::LinkToInstance. This must be one of the two,
    /// unless this class has not yet been fully initialized, in which case it will
    /// be set to ClassLink::Unlinked.
    linked_class: ClassLink<'gc>,

    /// The ClassObjects for this class.
    /// In almost all cases, this will either be empty or have a single object.
    /// However, a swf can run `newclass` multiple times on the same class
    /// to create multiple `ClassObjects`.
    class_objects: Vec<ClassObject<'gc>>,
}

impl PartialEq for Class<'_> {
    fn eq(&self, other: &Self) -> bool {
        GcCell::ptr_eq(self.0, other.0)
    }
}

impl Eq for Class<'_> {}

impl Hash for Class<'_> {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.as_ptr().hash(state);
    }
}

impl core::fmt::Debug for Class<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.debug_struct("Class").field("name", &self.name()).finish()
    }
}

impl<'gc> Class<'gc> {
    /// Create a new class.
    ///
    /// This function is primarily intended for use by native code to define
    /// builtin classes. The absolute minimum necessary to define a class is
    /// required here; further methods allow further changes to the class.
    ///
    /// Classes created in this way cannot have traits loaded from an ABC file
    /// using `load_traits`.
    pub fn new(
        name: QName<'gc>,
        super_class: Option<Class<'gc>>,
        instance_init: Option<Method<'gc>>,
        class_init: Option<Method<'gc>>,
        class_i_class: Class<'gc>,
        mc: &Mutation<'gc>,
    ) -> Self {
        let instance_allocator = super_class
            .map(|c| c.instance_allocator())
            .unwrap_or(Allocator(scriptobject_allocator));

        let i_class = Class(GcCell::new(
            mc,
            ClassData {
                name,
                param: None,
                super_class,
                attributes: ClassAttributes::empty(),
                protected_namespace: None,
                direct_interfaces: Vec::new(),
                all_interfaces: Vec::new(),
                instance_allocator,
                instance_init,
                traits: Vec::new(),
                vtable: VTable::empty(mc),
                call_handler: None,
                custom_constructor: None,
                traits_loaded: false,
                linked_class: ClassLink::Unlinked,
                applications: FnvHashMap::default(),
                class_objects: Vec::new(),
            },
        ));

        let name_namespace = name.namespace();
        let mut local_name_buf = WString::from(name.local_name().as_wstr());
        local_name_buf.push_char('$');

        let c_name = QName::new(name_namespace, AvmString::new(mc, local_name_buf));

        let c_class = Class(GcCell::new(
            mc,
            ClassData {
                name: c_name,
                param: None,
                super_class: Some(class_i_class),
                attributes: ClassAttributes::FINAL,
                protected_namespace: None,
                direct_interfaces: Vec::new(),
                all_interfaces: Vec::new(),
                instance_allocator: Allocator(scriptobject_allocator),
                instance_init: class_init,
                traits: Vec::new(),
                vtable: VTable::empty(mc),
                call_handler: None,
                custom_constructor: None,
                traits_loaded: false,
                linked_class: ClassLink::LinkToInstance(i_class),
                applications: FnvHashMap::default(),
                class_objects: Vec::new(),
            },
        ));

        i_class.set_c_class(mc, c_class);

        i_class
    }

    /// Create an unlinked class from its name, superclass, and traits.
    pub fn custom_new(
        name: QName<'gc>,
        super_class: Option<Class<'gc>>,
        traits: Vec<Trait<'gc>>,
        mc: &Mutation<'gc>,
    ) -> Self {
        Class(GcCell::new(
            mc,
            ClassData {
                name,
                param: None,
                super_class,
                attributes: ClassAttributes::empty(),
                protected_namespace: None,
                direct_interfaces: Vec::new(),
                all_interfaces: Vec::new(),
                instance_allocator: Allocator(scriptobject_allocator),
                instance_init: None,
                traits,
                vtable: VTable::empty(mc),
                call_handler: None,
                custom_constructor: None,
                traits_loaded: true,
                linked_class: ClassLink::Unlinked,
                applications: FnvHashMap::default(),
                class_objects: Vec::new(),
            },
        ))
    }

    pub fn add_application(self, mc: &Mutation<'gc>, param: Option<Class<'gc>>, cls: Class<'gc>) {
        self.0.write(mc).applications.insert(param, cls);
    }

    /// Apply type parameters to an existing class.
    ///
    /// This is used to parameterize a generic type. The returned class will no
    /// longer be generic.
    pub fn with_type_param(
        context: &mut UpdateContext<'gc>,
        this: Class<'gc>,
        param: Option<Class<'gc>>,
    ) -> Class<'gc> {
        let mc = context.gc();
        let this_read = this.0.read();

        if let Some(application) = this_read.applications.get(&param) {
            return *application;
        }

        // This can only happen for non-builtin Vector types,
        // so let's create one here directly.

        let object_vector_i_class = this_read
            .applications
            .get(&None)
            .expect("Vector.<*> not initialized?");

        let object_vector_c_class = object_vector_i_class
            .c_class()
            .expect("T$ cannot be generic");

        let param = param.expect("Trying to create Vector<*>, which shouldn't happen here");
        let name = format!("Vector.<{}>", param.name().to_qualified_name(mc));

        let new_class = Self::new(
            // FIXME - we should store a `Multiname` instead of a `QName`, and use the
            // `params` field. For now, this is good enough to get tests passing
            QName::new(this.name().namespace(), AvmString::new_utf8(mc, name)),
            Some(
                context
                    .avm2
                    .classes()
                    .object_vector
                    .inner_class_definition(),
            ),
            object_vector_i_class.instance_init(),
            object_vector_c_class.instance_init(),
            context.avm2.class_defs().class,
            mc,
        );

        new_class.set_param(mc, Some(Some(param)));
        new_class.0.write(mc).call_handler = object_vector_i_class.call_handler();

        new_class.mark_traits_loaded(context.gc());
        new_class
            .init_vtable(context)
            .expect("Vector class doesn't have any interfaces, so `init_vtable` cannot error");

        let c_class = new_class.c_class().expect("Class::new returns an i_class");

        c_class.mark_traits_loaded(context.gc());
        c_class
            .init_vtable(context)
            .expect("Vector$ class doesn't have any interfaces, so `init_vtable` cannot error");

        drop(this_read);

        this.0.write(mc).applications.insert(Some(param), new_class);
        new_class
    }

    /// Set the attributes of the class (sealed/final/interface status).
    pub fn set_attributes(self, mc: &Mutation<'gc>, attributes: ClassAttributes) {
        self.0.write(mc).attributes = attributes;
    }

    pub fn add_class_object(self, mc: &Mutation<'gc>, class_object: ClassObject<'gc>) {
        self.0.write(mc).class_objects.push(class_object);
    }

    pub fn class_objects(&self) -> Ref<Vec<ClassObject<'gc>>> {
        Ref::map(self.0.read(), |c| &c.class_objects)
    }

    pub fn class_object(self) -> Option<ClassObject<'gc>> {
        let read = self.0.read();

        if read.class_objects.len() == 1 {
            Some(read.class_objects[0])
        } else {
            None
        }
    }

    /// Construct a class from a `TranslationUnit` and its class index.
    ///
    /// The returned class will be allocated, but no traits will be loaded. The
    /// caller is responsible for storing the class in the `TranslationUnit`
    /// and calling `load_traits` to complete the trait-loading process.
    pub fn from_abc_index(
        unit: TranslationUnit<'gc>,
        class_index: u32,
        activation: &mut Activation<'_, 'gc>,
    ) -> Result<Self, Error<'gc>> {
        let mc = activation.gc();

        let i_class = Self::instance_from_abc_index(unit, class_index, activation)?;

        let c_class = Self::class_from_abc_index(
            unit,
            class_index,
            activation.avm2().class_defs().class,
            activation,
        )?;

        i_class.set_c_class(mc, c_class);
        c_class.set_i_class(mc, i_class);

        Ok(i_class)
    }

    /// Loads an i_class from a `TranslationUnit`, without loading its c_class.
    pub fn instance_from_abc_index(
        unit: TranslationUnit<'gc>,
        class_index: u32,
        activation: &mut Activation<'_, 'gc>,
    ) -> Result<Self, Error<'gc>> {
        let abc = unit.abc();
        let abc_instance = abc
            .instances
            .get(class_index as usize)
            .ok_or("LoadError: Instance index not valid")?;

        let name = QName::from_abc_multiname(activation, unit, abc_instance.name)?;

        let super_class = if abc_instance.super_name.0 == 0 {
            None
        } else {
            let multiname = unit.pool_multiname_static(activation, abc_instance.super_name)?;

            Some(
                activation
                    .domain()
                    .get_class(activation.context, &multiname)
                    .ok_or_else(|| {
                        make_error_1014(
                            activation,
                            Error1014Type::VerifyError,
                            multiname.to_qualified_name(activation.gc()),
                        )
                    })?,
            )
        };

        let protected_namespace = if let Some(ns) = &abc_instance.protected_namespace {
            Some(unit.pool_namespace(activation, *ns)?)
        } else {
            None
        };

        let mut interfaces = Vec::with_capacity(abc_instance.interfaces.len());
        for interface_name in &abc_instance.interfaces {
            let multiname = unit.pool_multiname_static(activation, *interface_name)?;

            interfaces.push(
                activation
                    .domain()
                    .get_class(activation.context, &multiname)
                    .ok_or_else(|| {
                        make_error_1014(
                            activation,
                            Error1014Type::VerifyError,
                            multiname.to_qualified_name(activation.gc()),
                        )
                    })?,
            );
        }

        let instance_init = unit.load_method(abc_instance.init_method, false, activation)?;

        let mut attributes = ClassAttributes::empty();
        attributes.set(ClassAttributes::SEALED, abc_instance.is_sealed);
        attributes.set(ClassAttributes::FINAL, abc_instance.is_final);
        attributes.set(ClassAttributes::INTERFACE, abc_instance.is_interface);

        let mut instance_allocator = None;
        let mut call_handler = None;
        let mut custom_constructor = None;

        // When loading a class from our playerglobal, grab the corresponding native
        // allocator function from the table (which may be `None`)
        if unit.domain().is_playerglobals_domain(activation.avm2()) {
            instance_allocator = activation.avm2().native_instance_allocator_table
                [class_index as usize]
                .map(Allocator);

            if let Some(table_native_call_handler) =
                activation.avm2().native_call_handler_table[class_index as usize]
            {
                call_handler = Some(table_native_call_handler);
            }

            if let Some(table_custom_constructor) =
                activation.avm2().native_custom_constructor_table[class_index as usize]
            {
                custom_constructor = Some(table_custom_constructor);
            }
        }

        let instance_allocator = instance_allocator
            .or_else(|| super_class.map(|c| c.instance_allocator()))
            .unwrap_or(Allocator(scriptobject_allocator));

        Ok(Class(GcCell::new(
            activation.gc(),
            ClassData {
                name,
                param: None,
                super_class,
                attributes,
                protected_namespace,
                direct_interfaces: interfaces,
                all_interfaces: Vec::new(),
                instance_allocator,
                instance_init: Some(instance_init),
                traits: Vec::new(),
                vtable: VTable::empty(activation.gc()),
                call_handler,
                custom_constructor: custom_constructor.map(CustomConstructor),
                traits_loaded: false,
                linked_class: ClassLink::Unlinked,
                applications: Default::default(),
                class_objects: Vec::new(),
            },
        )))
    }

    /// Loads a c_class from a `TranslationUnit`, without loading its i_class.
    pub fn class_from_abc_index(
        unit: TranslationUnit<'gc>,
        class_index: u32,
        class_class: Class<'gc>,
        activation: &mut Activation<'_, 'gc>,
    ) -> Result<Self, Error<'gc>> {
        let abc = unit.abc();

        let abc_instance = abc
            .instances
            .get(class_index as usize)
            .ok_or("LoadError: Instance index not valid")?;

        let abc_class = abc
            .classes
            .get(class_index as usize)
            .ok_or("LoadError: Class index not valid")?;

        // FIXME loading name again is a little wasteful
        let name = QName::from_abc_multiname(activation, unit, abc_instance.name)?;

        let protected_namespace = if let Some(ns) = &abc_instance.protected_namespace {
            Some(unit.pool_namespace(activation, *ns)?)
        } else {
            None
        };

        let class_init = unit.load_method(abc_class.init_method, false, activation)?;

        let name_namespace = name.namespace();
        let mut local_name_buf = WString::from(name.local_name().as_wstr());
        local_name_buf.push_char('$');

        let c_name = QName::new(
            name_namespace,
            AvmString::new(activation.gc(), local_name_buf),
        );

        Ok(Class(GcCell::new(
            activation.gc(),
            ClassData {
                name: c_name,
                param: None,
                super_class: Some(class_class),
                attributes: ClassAttributes::FINAL,
                protected_namespace,
                direct_interfaces: Vec::new(),
                all_interfaces: Vec::new(),
                instance_allocator: Allocator(scriptobject_allocator),
                instance_init: Some(class_init),
                traits: Vec::new(),
                vtable: VTable::empty(activation.gc()),
                call_handler: None,
                custom_constructor: None,
                traits_loaded: false,
                linked_class: ClassLink::Unlinked,
                applications: FnvHashMap::default(),
                class_objects: Vec::new(),
            },
        )))
    }

    /// Finish the class-loading process by loading traits.
    ///
    /// This process must be done after the `Class` has been stored in the
    /// `TranslationUnit`. Failing to do so runs the risk of runaway recursion
    /// or double-borrows. It should be done before the class is actually
    /// instantiated into an `Object`.
    pub fn load_traits(
        self,
        activation: &mut Activation<'_, 'gc>,
        unit: TranslationUnit<'gc>,
        class_index: u32,
    ) -> Result<(), Error<'gc>> {
        // We should only call `load_traits` on `i_class` Classes
        // (if i_class() is None it means that the Class is an i_class)
        assert!(self.i_class().is_none());

        if self.0.read().traits_loaded {
            return Ok(());
        }

        let c_class = self
            .c_class()
            .expect("Just checked that this class was an i_class");

        self.load_instance_traits(activation, unit, class_index)?;
        c_class.load_class_traits(activation, unit, class_index)?;

        Ok(())
    }

    /// Loads traits for an i_class from the instance traits declared in the ABC file.
    pub fn load_instance_traits(
        self,
        activation: &mut Activation<'_, 'gc>,
        unit: TranslationUnit<'gc>,
        class_index: u32,
    ) -> Result<(), Error<'gc>> {
        let mut write = self.0.write(activation.gc());

        write.traits_loaded = true;

        let abc = unit.abc();

        let abc_instance = abc
            .instances
            .get(class_index as usize)
            .ok_or("LoadError: Instance index not valid")?;

        for abc_trait in abc_instance.traits.iter() {
            write
                .traits
                .push(Trait::from_abc_trait(unit, abc_trait, activation)?);
        }

        Ok(())
    }

    /// Loads traits for a c_class from the class traits declared in the ABC file.
    pub fn load_class_traits(
        self,
        activation: &mut Activation<'_, 'gc>,
        unit: TranslationUnit<'gc>,
        class_index: u32,
    ) -> Result<(), Error<'gc>> {
        let mut write = self.0.write(activation.gc());

        write.traits_loaded = true;

        let abc = unit.abc();
        let abc_class = abc
            .classes
            .get(class_index as usize)
            .ok_or("LoadError: Class index not valid")?;

        for abc_trait in abc_class.traits.iter() {
            write
                .traits
                .push(Trait::from_abc_trait(unit, abc_trait, activation)?);
        }

        Ok(())
    }

    /// Completely validate a class against its resolved superclass.
    ///
    /// This should be called at class creation time once the superclass name
    /// has been resolved. It will return Ok for a valid class, and a
    /// VerifyError for any invalid class.
    pub fn validate_class(
        self,
        activation: &mut Activation<'_, 'gc>,
        allow_class_trait: bool,
    ) -> Result<(), Error<'gc>> {
        let read = self.0.read();

        let superclass = read.super_class;

        if let Some(superclass) = superclass {
            // We have to make an exception for `c_class`es
            if superclass.is_final() && !self.is_c_class() {
                return Err(Error::avm_error(verify_error(
                    activation,
                    &format!(
                        "Error #1103: Class {} cannot extend final base class.",
                        read.name.to_qualified_name(activation.gc())
                    ),
                    1103,
                )?));
            }

            if superclass.is_interface() {
                return Err(Error::avm_error(verify_error(
                    activation,
                    &format!(
                        "Error #1110: Class {} cannot extend {}.",
                        read.name.to_qualified_name(activation.gc()),
                        superclass
                            .name()
                            .to_qualified_name_err_message(activation.gc())
                    ),
                    1110,
                )?));
            }

            for instance_trait in read.traits.iter() {
                let is_protected = read.protected_namespace.is_some_and(|prot| {
                    prot.exact_version_match(instance_trait.name().namespace())
                });

                let mut current_superclass = Some(superclass);
                let mut did_override = false;

                while let Some(superclass) = current_superclass {
                    for supertrait in &*superclass.traits() {
                        let super_name = supertrait.name();
                        let my_name = instance_trait.name();

                        let names_match = super_name.local_name() == my_name.local_name()
                            && (super_name.namespace().matches_ns(my_name.namespace())
                                || (is_protected
                                    && superclass.protected_namespace().is_some_and(|prot| {
                                        prot.exact_version_match(super_name.namespace())
                                    })));
                        if names_match {
                            match (supertrait.kind(), instance_trait.kind()) {
                                //Getter/setter pairs do NOT override one another
                                (TraitKind::Getter { .. }, TraitKind::Setter { .. }) => continue,
                                (TraitKind::Setter { .. }, TraitKind::Getter { .. }) => continue,

                                (_, TraitKind::Const { .. }) | (_, TraitKind::Slot { .. }) => {
                                    did_override = true;

                                    // Const/Var traits override anything in avmplus
                                    // even if the base trait is marked as final or the
                                    // overriding trait isn't marked as override.
                                }
                                (_, TraitKind::Class { .. }) => {
                                    if !allow_class_trait {
                                        // Class traits aren't allowed in a class (except `global` classes)
                                        return Err(Error::avm_error(verify_error(
                                            activation,
                                            "Error #1059: ClassInfo is referenced before definition.",
                                            1059,
                                        )?));
                                    }
                                }
                                (TraitKind::Getter { .. }, TraitKind::Getter { .. })
                                | (TraitKind::Setter { .. }, TraitKind::Setter { .. })
                                | (TraitKind::Method { .. }, TraitKind::Method { .. }) => {
                                    did_override = true;

                                    if supertrait.is_final() {
                                        return Err(make_error_1053(
                                            activation,
                                            instance_trait.name().local_name(),
                                            read.name
                                                .to_qualified_name_err_message(activation.gc()),
                                        ));
                                    }

                                    if !instance_trait.is_override() {
                                        return Err(make_error_1053(
                                            activation,
                                            instance_trait.name().local_name(),
                                            read.name
                                                .to_qualified_name_err_message(activation.gc()),
                                        ));
                                    }
                                }
                                (_, TraitKind::Getter { .. })
                                | (_, TraitKind::Setter { .. })
                                | (_, TraitKind::Method { .. }) => {
                                    // Getters, setters, and methods cannot override
                                    // any other traits of a different type (except
                                    // slots, the logic for which is handled above)
                                    return Err(make_error_1053(
                                        activation,
                                        instance_trait.name().local_name(),
                                        read.name.to_qualified_name_err_message(activation.gc()),
                                    ));
                                }
                            }

                            break;
                        }
                    }

                    // The superclass is already validated so we don't need to
                    // check further.
                    if did_override {
                        break;
                    }

                    current_superclass = superclass.super_class();
                }

                if instance_trait.is_override() && !did_override {
                    return Err(make_error_1053(
                        activation,
                        instance_trait.name().local_name(),
                        read.name
                            .to_qualified_name_err_message(activation.context.gc_context),
                    ));
                }
            }
        }

        Ok(())
    }

    /// Like validate_class, but instead validates the method signatures of
    /// all methods, getters, and setters in the class. This should be called
    /// at ClassObject construction time, after all classes are loaded.
    pub fn validate_signatures(
        self,
        activation: &mut Activation<'_, 'gc>,
    ) -> Result<(), Error<'gc>> {
        let read = self.0.read();

        let superclass = read.super_class;

        if let Some(superclass) = superclass {
            for instance_trait in read.traits.iter() {
                let is_protected = read.protected_namespace.is_some_and(|prot| {
                    prot.exact_version_match(instance_trait.name().namespace())
                });

                let mut current_superclass = Some(superclass);
                let mut found_match = false;

                while let Some(superclass) = current_superclass {
                    for supertrait in &*superclass.traits() {
                        let super_name = supertrait.name();
                        let my_name = instance_trait.name();

                        let names_match = super_name.local_name() == my_name.local_name()
                            && (super_name.namespace().matches_ns(my_name.namespace())
                                || (is_protected
                                    && superclass.protected_namespace().is_some_and(|prot| {
                                        prot.exact_version_match(super_name.namespace())
                                    })));
                        if names_match {
                            match (supertrait.kind(), instance_trait.kind()) {
                                (TraitKind::Getter { .. }, TraitKind::Setter { .. }) => continue,
                                (TraitKind::Setter { .. }, TraitKind::Getter { .. }) => continue,

                                (_, TraitKind::Const { .. })
                                | (_, TraitKind::Slot { .. })
                                | (_, TraitKind::Class { .. }) => {
                                    found_match = true;
                                }
                                (TraitKind::Getter { .. }, TraitKind::Getter { .. })
                                | (TraitKind::Setter { .. }, TraitKind::Setter { .. })
                                | (TraitKind::Method { .. }, TraitKind::Method { .. }) => {
                                    found_match = true;

                                    let instance_method = instance_trait.as_method().unwrap();
                                    if !instance_method.is_info_resolved() {
                                        instance_method.resolve_info(activation)?;
                                    }

                                    let super_method = supertrait.as_method().unwrap();
                                    if !super_method.is_info_resolved() {
                                        super_method.resolve_info(activation)?;
                                    }

                                    // Methods must have same return type
                                    let instance_return_type =
                                        instance_method.resolved_return_type();
                                    let super_return_type = super_method.resolved_return_type();

                                    if instance_return_type != super_return_type {
                                        return Err(make_error_1053(
                                            activation,
                                            instance_trait.name().local_name(),
                                            read.name.to_qualified_name_err_message(
                                                activation.context.gc_context,
                                            ),
                                        ));
                                    }
                                }
                                _ => unreachable!("Other trait combinations are invalid"),
                            }

                            break;
                        }
                    }

                    // The signature is already validated so we don't need to
                    // check further.
                    if found_match {
                        break;
                    }

                    current_superclass = superclass.super_class();
                }
            }
        }

        Ok(())
    }

    pub fn init_vtable(self, context: &mut UpdateContext<'gc>) -> Result<(), Error<'gc>> {
        let read = self.0.read();

        if !read.traits_loaded {
            panic!(
                "Attempted to initialize vtable on a class that did not have its traits loaded yet"
            );
        }

        read.vtable.init_vtable(
            self,
            None,
            None,
            read.super_class.map(|c| c.vtable()),
            context.gc(),
        );
        drop(read);

        self.link_interfaces(context)?;

        Ok(())
    }

    pub fn link_interfaces(self, context: &mut UpdateContext<'gc>) -> Result<(), Error<'gc>> {
        let mut interfaces = Vec::with_capacity(self.direct_interfaces().len());

        let mut dedup = HashSet::new();
        let mut queue = vec![self];
        while let Some(cls) = queue.pop() {
            for interface in &*cls.direct_interfaces() {
                if !interface.is_interface() {
                    return Err(format!(
                        "Class {:?} is not an interface and cannot be implemented by classes",
                        interface.name().local_name()
                    )
                    .into());
                }

                if dedup.insert(*interface) {
                    queue.push(*interface);
                    interfaces.push(*interface);
                }
            }

            if let Some(super_class) = cls.super_class() {
                queue.push(super_class);
            }
        }

        // FIXME - we should only be copying properties for newly-implemented
        // interfaces (i.e. those that were not already implemented by the superclass)
        // Otherwise, our behavior diverges from Flash Player in certain cases.
        // See the ignored test 'tests/tests/swfs/avm2/weird_superinterface_properties/'
        let ns = context.avm2.namespaces.public_vm_internal();
        for interface in &interfaces {
            for interface_trait in &*interface.traits() {
                if !interface_trait.name().namespace().is_public() {
                    let public_name = QName::new(ns, interface_trait.name().local_name());
                    self.0.read().vtable.copy_property_for_interface(
                        context.gc(),
                        public_name,
                        interface_trait.name(),
                    );
                }
            }
        }

        self.0.write(context.gc()).all_interfaces = interfaces;

        Ok(())
    }

    pub fn for_activation(
        activation: &mut Activation<'_, 'gc>,
        translation_unit: TranslationUnit<'gc>,
        method: &AbcMethod,
        body: &AbcMethodBody,
    ) -> Result<Class<'gc>, Error<'gc>> {
        let name = translation_unit.pool_string(method.name.as_u30(), activation.strings())?;
        let mut traits = Vec::with_capacity(body.traits.len());

        for trait_entry in body.traits.iter() {
            let loaded_trait = Trait::from_abc_trait(translation_unit, trait_entry, activation)?;

            // Methods, getters, and setters are forbidden from appearing
            // in activation traits
            if loaded_trait.as_method().is_some() {
                // TODO: Is this the correct error?
                return Err(Error::avm_error(verify_error(
                    activation,
                    "Error #1101: Cannot verify method with unknown scope.",
                    1101,
                )?));
            }

            traits.push(loaded_trait);
        }

        let name = QName::new(activation.avm2().namespaces.public_all(), name);

        let i_class = Class(GcCell::new(
            activation.gc(),
            ClassData {
                name,
                param: None,
                super_class: None,
                attributes: ClassAttributes::FINAL | ClassAttributes::SEALED,
                protected_namespace: None,
                direct_interfaces: Vec::new(),
                all_interfaces: Vec::new(),
                instance_allocator: Allocator(scriptobject_allocator),
                instance_init: None,
                traits,
                vtable: VTable::empty(activation.gc()),
                call_handler: None,
                custom_constructor: None,
                traits_loaded: true,
                linked_class: ClassLink::Unlinked,
                applications: Default::default(),
                class_objects: Vec::new(),
            },
        ));

        i_class.init_vtable(activation.context)?;

        // We don't need to construct a c_class

        Ok(i_class)
    }

    pub fn for_catch(
        activation: &mut Activation<'_, 'gc>,
        variable_name: QName<'gc>,
    ) -> Result<Class<'gc>, Error<'gc>> {
        // TODO make the slot typed
        let traits = vec![Trait::from_const(variable_name, None, None)];

        let i_class = Class(GcCell::new(
            activation.gc(),
            ClassData {
                // Yes, the name of the class is the variable's name
                name: variable_name,
                param: None,
                super_class: None,
                attributes: ClassAttributes::FINAL | ClassAttributes::SEALED,
                protected_namespace: None,
                direct_interfaces: Vec::new(),
                all_interfaces: Vec::new(),
                instance_allocator: Allocator(scriptobject_allocator),
                instance_init: None,
                traits,
                vtable: VTable::empty(activation.gc()),
                call_handler: None,
                custom_constructor: None,
                traits_loaded: true,
                linked_class: ClassLink::Unlinked,
                applications: Default::default(),
                class_objects: Vec::new(),
            },
        ));

        i_class.init_vtable(activation.context)?;

        // We don't need to construct a c_class

        Ok(i_class)
    }

    /// Determine if this class has a given type in its superclass chain.
    ///
    /// The given class `test_class` should be either a superclass or
    /// interface we are checking against this class.
    ///
    /// To test if a class *instance* is of a given type, see `Object::is_of_type`.
    pub fn has_class_in_chain(self, test_class: Class<'gc>) -> bool {
        let mut my_class = Some(self);

        while let Some(class) = my_class {
            if class == test_class {
                return true;
            }

            my_class = class.super_class()
        }

        // A `Class` stores all of the interfaces it implements, including
        // those from superinterfaces and superclasses (recursively).
        if test_class.is_interface() {
            for interface in &*self.all_interfaces() {
                if *interface == test_class {
                    return true;
                }
            }
        }

        false
    }

    pub fn vtable(self) -> VTable<'gc> {
        self.0.read().vtable
    }

    pub fn dollar_removed_name(self, mc: &Mutation<'gc>) -> QName<'gc> {
        let name = self.0.read().name;

        let namespace = name.namespace();

        let local_name = name.local_name();
        let local_name_wstr = local_name.as_wstr();

        // Matching avmplus, this doesn't check whether the class is a
        // c_class; it strips the suffix even for i_classes
        if let Some(stripped) = local_name_wstr.strip_suffix(b'$') {
            let new_local_name = AvmString::new(mc, stripped);

            QName::new(namespace, new_local_name)
        } else {
            name
        }
    }

    pub fn name(self) -> QName<'gc> {
        self.0.read().name
    }

    pub fn set_name(self, mc: &Mutation<'gc>, name: QName<'gc>) {
        self.0.write(mc).name = name;
    }

    pub fn try_name(self) -> Result<QName<'gc>, std::cell::BorrowError> {
        self.0.try_read().map(|r| r.name)
    }

    /// Attempts to obtain the name of this class.
    /// If we are unable to read from the necessary `GcCell`,
    /// the returned value will be some kind of error message.
    ///
    /// This should only be used in a debug context, where
    /// we need infallible access to *something* to print
    /// out.
    pub fn debug_name(self) -> Box<dyn fmt::Debug + 'gc> {
        let class_name = self.try_name();

        match class_name {
            Ok(class_name) => Box::new(class_name),
            Err(err) => Box::new(err),
        }
    }

    pub fn param(self) -> Option<Option<Class<'gc>>> {
        self.0.read().param
    }

    pub fn set_param(self, mc: &Mutation<'gc>, param: Option<Option<Class<'gc>>>) {
        self.0.write(mc).param = param;
    }

    pub fn super_class(self) -> Option<Class<'gc>> {
        self.0.read().super_class
    }

    pub fn super_class_name(self) -> Option<Multiname<'gc>> {
        self.0.read().super_class.map(|c| c.name().into())
    }

    pub fn protected_namespace(self) -> Option<Namespace<'gc>> {
        self.0.read().protected_namespace
    }

    pub fn mark_traits_loaded(self, mc: &Mutation<'gc>) {
        self.0.write(mc).traits_loaded = true;
    }

    /// Return traits provided by this class.
    pub fn traits(&self) -> Ref<Vec<Trait<'gc>>> {
        Ref::map(self.0.read(), |c| &c.traits)
    }

    /// Get this class's instance allocator.
    ///
    /// If `None`, then you should use the instance allocator of the superclass
    /// or allocate as a `ScriptObject` if no such class exists.
    pub fn instance_allocator(self) -> Allocator {
        self.0.read().instance_allocator
    }

    /// Get this class's custom constructor.
    ///
    /// If `None`, then this class should be constructed normally.
    pub fn custom_constructor(self) -> Option<CustomConstructor> {
        self.0.read().custom_constructor
    }

    /// Get this class's instance initializer.
    pub fn instance_init(self) -> Option<Method<'gc>> {
        self.0.read().instance_init
    }

    /// Get this class's call handler.
    pub fn call_handler(self) -> Option<NativeMethodImpl> {
        self.0.read().call_handler
    }

    pub fn direct_interfaces(&self) -> Ref<Vec<Class<'gc>>> {
        Ref::map(self.0.read(), |c| &c.direct_interfaces)
    }

    pub fn all_interfaces(&self) -> Ref<Vec<Class<'gc>>> {
        Ref::map(self.0.read(), |c| &c.all_interfaces)
    }

    /// Determine if this class is sealed (no dynamic properties)
    pub fn is_sealed(self) -> bool {
        self.0.read().attributes.contains(ClassAttributes::SEALED)
    }

    /// Determine if this class is final (cannot be subclassed)
    pub fn is_final(self) -> bool {
        self.0.read().attributes.contains(ClassAttributes::FINAL)
    }

    /// Determine if this class is an interface
    pub fn is_interface(self) -> bool {
        self.0
            .read()
            .attributes
            .contains(ClassAttributes::INTERFACE)
    }

    /// Determine if this class is generic (can be specialized)
    pub fn is_generic(self) -> bool {
        self.0.read().attributes.contains(ClassAttributes::GENERIC)
    }

    pub fn c_class(self) -> Option<Class<'gc>> {
        if let ClassLink::LinkToClass(c_class) = self.0.read().linked_class {
            Some(c_class)
        } else {
            None
        }
    }

    pub fn set_c_class(self, mc: &Mutation<'gc>, c_class: Class<'gc>) {
        assert!(matches!(self.0.read().linked_class, ClassLink::Unlinked));

        self.0.write(mc).linked_class = ClassLink::LinkToClass(c_class);
    }

    pub fn is_c_class(self) -> bool {
        matches!(self.0.read().linked_class, ClassLink::LinkToInstance(_))
    }

    pub fn i_class(self) -> Option<Class<'gc>> {
        if let ClassLink::LinkToInstance(i_class) = self.0.read().linked_class {
            Some(i_class)
        } else {
            None
        }
    }

    pub fn set_i_class(self, mc: &Mutation<'gc>, i_class: Class<'gc>) {
        assert!(matches!(self.0.read().linked_class, ClassLink::Unlinked));

        self.0.write(mc).linked_class = ClassLink::LinkToInstance(i_class);
    }

    pub fn is_i_class(self) -> bool {
        matches!(self.0.read().linked_class, ClassLink::LinkToClass(_))
    }
}
