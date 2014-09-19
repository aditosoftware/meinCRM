var id = a.valueof("$comp.idcolumn");
var p2pid = a.valueof("$comp.lbl_partlist_prod2prod");
var sql = a.EMPTY_TABLE_SQL

if (id != '') 
{
    if (p2pid == '')	sql2 = " = '" + id + "'";
    else sql2 = " in (select SOURCE_ID from PROD2PROD where PROD2PRODID = '" + p2pid + "')";

    sql = "select PROD2PRODID, SOURCE_ID, QUANTITY, OPTIONAL, TAKEPRICE "
        + " from PROD2PROD where DEST_ID " + sql2;
}
a.rq(sql);