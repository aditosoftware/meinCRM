var ids = a.valueofObj("$local.idvalue");
var sqlstr = "select ORDERITEMID, ITEMSORT, PRODUCT_ID, QUANTITY, UNIT, PRICE, DISCOUNT, '', VAT, DESCRIPTION from ORDERITEM where ";

if ( ids == "undefined")  sqlstr += "SALESORDER_ID = '" + a.valueof("$comp.idcolumn") + "' order by ITEMSORT";
else  sqlstr += "ORDERITEMID in ('" + ids.join("','") + "') order by ITEMSORT";

a.ro( a.sql(sqlstr,a.SQL_COMPLETE) );