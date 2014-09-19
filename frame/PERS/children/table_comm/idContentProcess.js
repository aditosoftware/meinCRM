var id = a.valueof("$comp.idcolumn");
var list = "";

if (id != "")
{
    list = a.sql("select COMMID, -1, MEDIUM_ID, ADDR from COMM where RELATION_ID = '" + id + "'", a.SQL_COMPLETE);
}
a.ro(list);