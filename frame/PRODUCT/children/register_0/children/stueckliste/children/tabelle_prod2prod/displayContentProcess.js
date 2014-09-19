var id = a.valueof("$comp.idcolumn");
var p2pid = a.valueof("$comp.lbl_partlist_prod2prod");
var sql = a.EMPTY_TABLE_SQL

if (id != '') 
{
    if (p2pid == '')	sql2 = " = '" + id + "'";
    else sql2 = " in (select source_id from prod2prod where prod2prodid = '" + p2pid + "')";

    sql = "select PROD2PRODID, PRODUCTNAME, QUANTITY, OPTIONAL, TAKEPRICE "
        + " from PROD2PROD join PRODUCT on (PRODUCTID = SOURCE_ID) where DEST_ID " + sql2;
}
a.rq(sql);