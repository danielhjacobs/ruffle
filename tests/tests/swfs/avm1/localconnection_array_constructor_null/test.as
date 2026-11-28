// LocalConnection should still decode AMF0 arrays when the script-visible
// Array binding is null and therefore cannot be called as a constructor.
trace("--- Starting LocalConnection null Array constructor test ---");

var savedArrayConstructor = _global.Array;

var receiver = new LocalConnection();
receiver.onReceiveArrays = function(ecmaValue, strictValue) {
    trace("--- Received LocalConnection arrays ---");
    trace("ECMAArray result type: " + typeof(ecmaValue));
    trace("StrictArray result type: " + typeof(strictValue));

    // Restore the global after both arguments have been deserialized.
    _global.Array = savedArrayConstructor;
    trace("Restored Array constructor: " + (_global.Array == savedArrayConstructor));
};
trace("Connected: " + receiver.connect("array_constructor_null"));

var sender = new LocalConnection();

// An explicit undefined element forces LocalConnection to use an ECMAArray.
var ecmaArray = new Array();
ecmaArray[0] = undefined;
ecmaArray[1] = "ecma-tail";

// A dense array with no undefined/function/display-object values uses a
// StrictArray.
var strictArray = ["strict-first", "strict-second"];

trace("Original Array constructor is callable: " + (typeof(savedArrayConstructor) == "function"));
_global.Array = null;
sender.send(
    "array_constructor_null",
    "onReceiveArrays",
    ecmaArray,
    strictArray
);
