import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
[5, "QUANTITY"],
[7, "PRICE"],
[8, "DISCOUNT"],
[11, "OPTIONAL"]
];
var updanz = updtable(fields, row, "OFFERITEM", "OFFERITEMID");

a.refresh("$comp.NET");