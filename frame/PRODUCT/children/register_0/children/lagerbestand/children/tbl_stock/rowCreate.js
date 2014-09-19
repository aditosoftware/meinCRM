import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "ENTRYDATE"],
[2, "IN_OUT"],
[3, "QUANTITY"],
[4, "REFNUMBER"]
];

var vkfields = [[a.valueof("$comp.PRODUCTID"), "PRODUCT_ID"]];
var updanz = instable(fields, vkfields, row, "STOCK", "STOCKID");