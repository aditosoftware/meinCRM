import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "PARTICIPANT"],
[2, "FRAGE"],
[3, "NOTE"],
[4, "INFO"]
];

var updanz = updtable(fields, row, "FEEDBACK", "FEEDBACKID");