import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "SOURCE_ID"],
[2, "QUANTITY"],
[3, "OPTIONAL"],
[4, "TAKEPRICE"]
];

var updanz = updtable(fields, row, "PROD2PROD", "PROD2PRODID");