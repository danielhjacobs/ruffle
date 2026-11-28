var originalDate = _global.Date;
var scriptDateConstructorCalls = 0;

function ScriptDate() {
    scriptDateConstructorCalls++;
    this.constructorWasCalled = true;
}

ScriptDate.prototype.amf0DatePrototypeMarker = "ScriptDate prototype";

function inspectSharedObject(name, label) {
    var so = SharedObject.getLocal(name, "/");

    trace(label + ".saved: " + so.data.saved);
    trace(label + ".hasDate: " + so.data.hasOwnProperty("date"));

    return so.data.date;
}

// Missing global Date binding.
trace("--- Missing Date binding ---");
_global.Date = undefined;

var missingDate = inspectSharedObject("DateMissing", "Missing");

trace("Date type: " + typeof(missingDate));
trace("Date is undefined: " + (missingDate === undefined));

// Non-callable global Date binding.
trace("--- Non-callable Date binding ---");
_global.Date = new Object();

var nonCallableDate = inspectSharedObject("DateNonCallable", "Non-callable");

trace("Date type: " + typeof(nonCallableDate));
trace("Date is undefined: " + (nonCallableDate === undefined));

// Script-defined global Date binding.
trace("--- Script-defined Date binding ---");
_global.Date = ScriptDate;

trace("Global Date is ScriptDate: " + (_global.Date === ScriptDate));
trace("Global Date type: " + typeof(_global.Date));

var scriptDate = inspectSharedObject("DateScriptDefined", "Script-defined");

trace("Date type: " + typeof(scriptDate));
trace("Prototype marker: " + scriptDate.amf0DatePrototypeMarker);
trace("Is ScriptDate: " + (scriptDate instanceof ScriptDate));
trace("Constructor calls: " + scriptDateConstructorCalls);
trace("Constructor own property: " +
    scriptDate.hasOwnProperty("constructorWasCalled"));
trace("getTime type: " + typeof(scriptDate.getTime));

_global.Date = originalDate;
