import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[3, "TABLETYPE"],
[4, "AOMODULE"],
[5, "LONGNAME"],
[6, "TABLENAME"],
[7, "DESCRIPTION"]
];

//var vkfields = [[a.valueof("$comp.PRODUCTID"), "PRODUCT_ID"]];
var updanz = instable(fields, [], row, "AOSYS_TABLEREPOSITORY", "TABLEID");