import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
[1, "ITEMSORT"],
[2, "GROUPCODEID"],
[3, "PRODUCT_ID"],
[5, "QUANTITY"],
[6, "UNIT"],
[7, "PRICE"],
[8, "DISCOUNT"],
[10, "VAT"],
[11, "DESCRIPTION"]
];
var updanz = updtable(fields, row, "SERVICEITEM", "SERVICEITEMID");