import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var fields = [
[3, "ITEMPOSITION"],
[4, "PRODUCT_ID"],
[5, "QUANTITY"],
[6, "UNIT"],
[7, "PRICE"],
[8, "DISCOUNT"],
[10, "VAT"],
[12, "DESCRIPTION"]
];

var itemname = a.sql("select ITEMNAME from OFFERITEM where PRODUCT_ID = '" + row[4] + "' ");
var vkfields = [[a.valueof("$comp.idcolumn"), "OFFER_ID"], [1, "OPTIONAL"],[itemname, "ITEMNAME"]]; 
var insanz = instable(fields, vkfields, row, "OFFERITEM", "OFFERITEMID");
a.refresh("$comp.NET");
