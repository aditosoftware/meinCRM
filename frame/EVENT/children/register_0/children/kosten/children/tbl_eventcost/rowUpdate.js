import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "COSTTYPE"],
[2, "COSTVALUE"]
];

var updanz = updtable(fields, row, "EVENTCOST", "EVENTCOSTID");