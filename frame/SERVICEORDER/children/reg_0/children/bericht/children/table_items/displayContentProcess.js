import("lib_keyword");
var orderid = a.valueof("$comp.idcolumn");
var list = a.createEmptyTable(10);

if ( orderid != "") 
{
    list = a.sql("select SERVICEITEMID, ITEMSORT, " + getKeySQL("GroupCode", "SERVICEITEM.GROUPCODEID")
        + ", PRODUCTNAME, PRODUCTCODE, QUANTITY, " + getKeySQL("Einheiten", "SERVICEITEM.UNIT") 
        + ", PRICE, DISCOUNT, QUANTITY * PRICE * (100 - DISCOUNT) / 100, VAT, SERVICEITEM.DESCRIPTION "
        + " from SERVICEITEM join PRODUCT on (PRODUCTID = SERVICEITEM.PRODUCT_ID) "
        + " where SERVICEORDER_ID = '" + orderid + "' order by ITEMSORT", a.SQL_COMPLETE);
}
a.ro(list);