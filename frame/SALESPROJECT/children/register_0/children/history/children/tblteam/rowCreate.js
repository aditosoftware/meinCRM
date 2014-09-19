import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
[1, "RELATION_ID"],
[2, "SALESPROJECTROLE"]
];

var vkfields = [[a.valueof("$comp.SALESPROJECTID"), "SALESPROJECT_ID"]];
var updanz = instable(fields, vkfields, row, "SPMEMBER", "SPMEMBERID");