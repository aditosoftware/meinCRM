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

var updanz = updtable(fields, row, "AOSYS_COLUMNREPOSITORY", "COLUMNID");