import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[1, "SOURCE_ID"],
[2, "QUANTITY"],
[3, "OPTIONAL"],
[4, "TAKEPRICE"]
];

var vkfields = [[a.valueof("$comp.lbl_partlist_prodid"), "DEST_ID"]];
var updanz = instable(fields, vkfields, row, "PROD2PROD", "PROD2PRODID");