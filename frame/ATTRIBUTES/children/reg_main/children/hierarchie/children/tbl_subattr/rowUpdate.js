import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ATTRNAME"],
[2, "ATTRCOMPONENT"],
[3, "ATTRDATADEFINITION"],
[4, "AOACTIVE"],
[5, "ATTRSORT"]
];

var updanz = updtable(fields, row, "ATTR", "ATTRID");