var id = a.valueof("$comp.idcolumn");
var list =[];
if (id != '')
{
	var sql = "select SPCYCLEID, ENTRYDATE, STATUSPHASE, KEYVAL, DAYS from SPCYCLE where SALESPROJECT_ID = '" + id + "' order by ENTRYDATE desc";
//	var sql = "select SPCYCLEID, ENTRYDATE, STATUS, PHASE, MILESTONE, DAYS from SPCYCLE where SALESPROJECT_ID = '" + id + "' order by ENTRYDATE desc";
	list = a.sql(sql, a.SQL_COMPLETE);
}
a.ro(list);