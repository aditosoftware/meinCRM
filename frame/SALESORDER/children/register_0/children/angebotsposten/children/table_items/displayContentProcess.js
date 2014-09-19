import("lib_keyword");
import("lib_sql");

var orderid = a.valueof("$comp.idcolumn");
var list = a.createEmptyTable(10);
var lang = getKeyName(a.valueof("$comp.LANGUAGE"), "SPRACHE", "keyname2");

if ( orderid != "") 
{
    list = a.sql("select ORDERITEMID, ITEMSORT, "+ concat([ "PRODUCTCODE","'/'", "ITEMNAME"]) + ", QUANTITY, " + getKeySQL("Einheiten", "ORDERITEM.UNIT", lang)
        + ", PRICE, DISCOUNT, (QUANTITY * PRICE * (100 - DISCOUNT) / 100 ), VAT, ORDERITEM.DESCRIPTION "
        + " from ORDERITEM join PRODUCT on (PRODUCTID = ORDERITEM.PRODUCT_ID) "
        + " where SALESORDER_ID = '" + orderid + "' order by ITEMSORT", a.SQL_COMPLETE);
}
a.ro(list);