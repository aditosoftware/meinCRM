import("lib_tablecomp");
import("lib_keyword");

var row = a.valueofObj("$local.rowdata");

var fields = [
[1, "ITEMSORT"],
[2, "PRODUCT_ID"],
[3, "QUANTITY"],
[4, "UNIT"],
[5, "PRICE"],
[6, "DISCOUNT"],
[8, "VAT"],
[9, "DESCRIPTION"]
];

var language = getKeyName(a.valueof("$comp.LANGUAGE"), "SPRACHE", "KEYNAME2");
var itemname = a.sql("select SHORTTEXT from TEXTBLOCK where AOTYPE = 1 and TABLENAME = 'PRODUCT' and ROW_ID = '" 
        + row[2] + "' and LANG = " + a.valueof("$comp.LANGUAGE"));
if ( itemname == "")  itemname = a.sql("SELECT PRODUCTNAME FROM PRODUCT WHERE PRODUCTID = '" + row[2] + "'");
var groupcode = a.sql("SELECT GROUPCODEID from PRODUCT where PRODUCTID = '" + row[2] + "'");
var vkfields = [[a.valueof("$comp.idcolumn"), "SALESORDER_ID"], [1, "OPTIONAL"], [itemname, "ITEMNAME"], [groupcode, "GROUPCODEID"]];
var updanz = instable(fields, vkfields, row, "ORDERITEM", "ORDERITEMID");

a.refresh("$comp.NET");
