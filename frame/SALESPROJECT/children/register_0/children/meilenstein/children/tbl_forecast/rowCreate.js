import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
[1, "GROUPCODEID"],
[2, "STARTDATE"],
[3, "VOLUME"],
[4, "INFO"]
];

var vkfields = [[a.valueof("$comp.idcolumn"), "SALESPROJECT_ID"]];
var updanz = instable(fields, vkfields, row, "SPFORECAST", "SPFORECASTID");