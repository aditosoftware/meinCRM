var id = a.valueof("$comp.idcolumn");
var list = "";

if (id != "")
{
    list = a.sql("select HISTORYLINKID, case when OBJECT_ID in (1,2) then 3 else OBJECT_ID end, ROW_ID "
        + " from HISTORYLINK where HISTORY_ID = '" + id + "'", a.SQL_COMPLETE);
}
if (list.length == 0) 	list = a.createEmptyTable(3);
a.ro(list);