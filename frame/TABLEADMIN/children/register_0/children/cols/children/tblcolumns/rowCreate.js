import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[2, "CONSTRAINTTYPE"],
[3, "LONGNAME"],
[4, "COLUMNNAME"],
[5, "DATATYPE"],
[6, "KEYNAME"],
[7, "COLUMNSIZE"],
[8, "NULLABLE"],
[9, "LOGGING"],
[10, "CUSTOMIZED"],
[11, "DESCRIPTION"]
];

var vkfields = [[a.valueof("$comp.TABLEID"), "TABLE_ID"]];
var updanz = instable(fields, vkfields, row, "AOSYS_COLUMNREPOSITORY", "COLUMNID");