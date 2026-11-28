var originalObject = Object;
var originalDate = Date;

var dateGetterCalls = 0;
var scriptDateConstructorCalls = 0;

function ScriptDate() {
    scriptDateConstructorCalls++;
    this.scriptDateConstructorWasCalled = true;
}

ScriptDate.prototype.amf0DatePrototypeMarker =
    "ScriptDate prototype";

// Return the native constructor for the first lookup (the
// SharedObject date preflight), then the script constructor
// when the AMF0 Date is actually deserialized.
var dateGetterInstalled = originalObject.prototype.addProperty.call(
    _global,
    "Date",
    function() {
        dateGetterCalls++;

        trace("GLOBAL Date getter: " + dateGetterCalls);

        if (dateGetterCalls == 1) {
            return originalDate;
        }

        return ScriptDate;
    },
    null
);

trace("Date getter installed: " + dateGetterInstalled);

var so = SharedObject.getLocal("AMF0StrictArrayDate", "/");

if (so.data.saved === undefined) {
    trace("--- Initialize SharedObject ---");

    var dates = new Array(1);
    dates[0] = new originalDate(1234567890000);

    so.data.saved = true;
    so.data.dates = dates;

    trace("StrictArray length: " + dates.length);
    trace("Initial Date getter calls: " + dateGetterCalls);

    so.flush();
} else {
    trace("--- Reload SharedObject ---");

    var dates = so.data.dates;
    var date = dates[0];

    trace("Saved: " + so.data.saved);
    trace("StrictArray length: " + dates.length);

    trace("Date getter calls: " + dateGetterCalls);
    trace("Date type: " + typeof(date));

    trace("Prototype marker: " +
        date.amf0DatePrototypeMarker);

    trace("Is ScriptDate: " +
        (date instanceof ScriptDate));

    trace("ScriptDate constructor calls: " +
        scriptDateConstructorCalls);

    trace("Constructor own property: " +
        date.hasOwnProperty("scriptDateConstructorWasCalled"));

    trace("getTime type: " + typeof(date.getTime));
}
