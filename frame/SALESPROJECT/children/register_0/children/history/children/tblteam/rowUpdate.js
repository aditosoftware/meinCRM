import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
[1, "RELATION_ID"],
[2, "SALESPROJECTROLE"]
];

var updanz = updtable(fields, row, "SPMEMBER", "SPMEMBERID");