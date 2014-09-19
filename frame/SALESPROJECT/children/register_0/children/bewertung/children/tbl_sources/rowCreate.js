import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
[1, "ENTRYDATE"],
[2, "SOURCE"],
[3, "INFO"]
];

var vkfields = [[a.valueof("$comp.idcolumn"), "SALESPROJECT_ID"]];
var updanz = instable(fields, vkfields, row, "SPSOURCES", "SPSOURCESID");