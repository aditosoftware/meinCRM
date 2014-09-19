var id = a.valueof("$comp.idcolumn");
var list = [];

if (id != "")
	list = a.sql("select SPFORECASTID, GROUPCODEID, STARTDATE, VOLUME, INFO"
		+ " from SPFORECAST where SALESPROJECT_ID = '" + id + "'", a.SQL_COMPLETE);
a.ro(list);