// AMF0 XML values use the built-in XML class, even if the receiving SWF
// has modified or removed the global XML constructor.

var receiver = new LocalConnection();
receiver.onReceiveData = function(payload) {
    var items = payload.items;
    trace("XML value type: " + typeof(items[0]));
    trace("Array length: " + items.length);
    trace("Object property: " + items[1].marker);
};
receiver.connect("xml_unavailable");

var xml = new XML("<root/>");
var shared = {marker: "shared"};
var payload = {
    items: [xml, shared, shared]
};

// The XML value should still be instantiated by the built-in XML class.
_global.XML = undefined;

var sender = new LocalConnection();
sender.send("xml_unavailable", "onReceiveData", payload);
