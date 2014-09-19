import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "PARTICIPANT"],
[2, "FRAGE"],
[3, "NOTE"],
[4, "INFO"]
];

var vkfields = [[a.valueof("$comp.EVENTID"), "EVENT_ID"]];
var updanz = instable(fields, vkfields, row, "FEEDBACK", "FEEDBACKID");