var id = a.valueof("$comp.idcolumn");
var list = [];
if (id != '')
{
	list = a.sql("select SPCOMPETITIONID, "
		+ " case when DATECANCELLED is null then -16777216 else -2830136 end , ORGNAME, "
		+ " STATUS, DATECANCELLED, REASON, INFO from SPCOMPETITION "
		+ " where SALESPROJECT_ID = '" + id + "' order by ORGNAME", a.SQL_COMPLETE);
}
a.ro(list);