import("lib_keyword");

var id = a.valueof("$comp.idcolumn");
var list = [];

if (id != "")
	list = a.sql("select SPSOURCESID, ENTRYDATE, " + getKeySQL("SPSOURCE", "SPSOURCES.SOURCE") + ", INFO "
	+ " from SPSOURCES where SALESPROJECT_ID = '" + id + "' order by ENTRYDATE", a.SQL_COMPLETE);

a.ro(list);