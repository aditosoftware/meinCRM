import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ATTROBJECT"],
[2, "MINCOUNT"],
[3, "MAXCOUNT"],
[4, "KEYVALUE"]
];

var vkfields = [[a.valueof("$comp.attrid"), "ATTR_ID"]];
var updanz = instable(fields, vkfields, row, "ATTROBJECT", "ATTROBJECTID");