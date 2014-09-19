import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[2, "ADDR_TYPE"],
[3, "ADDRIDENTIFIER"],
[4, "ADDRESS"],
[5, "BUILDINGNO"],
[6, "ADDRESSADDITION"],
[7, "ZIP"],
[8, "CITY"],
[9, "DISTRICT"],
[10, "REGION"],
[11, "STATE"],
[12, "COUNTRY"]
];
updtable(fields, row, "ADDRESS", "ADDRESSID");