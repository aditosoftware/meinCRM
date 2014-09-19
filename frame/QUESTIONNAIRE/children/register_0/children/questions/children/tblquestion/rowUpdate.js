import("lib_tablecomp");

// bestehenden Fragebogen editieren
var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "QUESTIONCODE"],
[2, "COMPONENTTYPE"],
[3, "QUESTIONTEXT"],
[4, "HINTTEXT"]
];

var updanz = updtable(fields, row, "QUESTION", "QUESTIONID");