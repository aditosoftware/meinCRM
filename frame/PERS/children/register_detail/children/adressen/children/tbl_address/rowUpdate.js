import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[4, "ADDR_TYPE"],
[5, "ADDRIDENTIFIER"],
[6, "ADDRESS"],
[7, "BUILDINGNO"],
[8, "ADDRESSADDITION"],
[9, "ZIP"],
[10, "CITY"],
[11, "DISTRICT"],
[12, "REGION"],
[13, "STATE"],
[14, "COUNTRY"]
];
updtable(fields, row, "ADDRESS", "ADDRESSID");