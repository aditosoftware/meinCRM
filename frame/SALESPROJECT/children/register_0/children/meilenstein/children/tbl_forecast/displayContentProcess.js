import("lib_keyword")

var id = a.valueof("$comp.idcolumn");
var list = [];

if (id != "")
	list = a.sql("select SPFORECASTID, " + getKeySQL("GroupCode", "GROUPCODEID") + ", STARTDATE, VOLUME, INFO"
		+ " from SPFORECAST where SALESPROJECT_ID = '" + id + "' order by STARTDATE desc", a.SQL_COMPLETE);
a.ro(list);