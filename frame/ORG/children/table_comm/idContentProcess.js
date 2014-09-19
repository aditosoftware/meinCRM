var list = "";
var relationid = a.valueof("$comp.Label_relpers_dec");
if (relationid == "")	 relationid = a.valueof("$comp.relationid");

if (relationid != "")
{
    list = a.sql("select COMMID, -1, MEDIUM_ID, ADDR from COMM where RELATION_ID = '" + relationid + "'", a.SQL_COMPLETE);
}
if (list.length == 0) 	list = a.createEmptyTable(4);
a.ro(list);