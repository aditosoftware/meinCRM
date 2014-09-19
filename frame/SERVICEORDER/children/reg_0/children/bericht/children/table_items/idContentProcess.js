var ids = a.valueofObj("$local.idvalue");
var sqlstr = "select SERVICEITEMID, ITEMSORT, GROUPCODEID, PRODUCT_ID, '', QUANTITY, UNIT, PRICE, DISCOUNT, '', VAT, DESCRIPTION "
+ " from SERVICEITEM where ";

if ( ids == "undefined")  sqlstr += "SERVICEORDER_ID = '" + a.valueof("$comp.idcolumn") + "' order by ITEMSORT";
else  sqlstr += "SERVICEITEMID in ('" + ids.join("','") + "') order by ITEMSORT";

a.ro( a.sql(sqlstr,a.SQL_COMPLETE) );


//import("lib_keyword");
//var orderid = a.valueof("$comp.idcolumn");
//var list = a.createEmptyTable(10);
//
//if ( orderid != "") 
//{
//	list = a.sql("select SERVICEITEMID, ITEMSORT, GROUPCODEID, PRODUCT_ID, '', QUANTITY, UNIT, PRICE, DISCOUNT, '', VAT, DESCRIPTION "
//		+ " from SERVICEITEM where SERVICEORDER_ID = '" + orderid + "' order by ITEMSORT", a.SQL_COMPLETE);
//}
//a.ro(list);
//
//
//