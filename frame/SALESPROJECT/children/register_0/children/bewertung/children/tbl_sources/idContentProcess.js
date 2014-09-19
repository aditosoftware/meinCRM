var id = a.valueof("$comp.idcolumn");
var list = [];

if (id != "")
	list = a.sql("select SPSOURCESID, ENTRYDATE, SOURCE, INFO "
	+ " from SPSOURCES where SALESPROJECT_ID = '" + id + "' order by ENTRYDATE", a.SQL_COMPLETE);

a.ro(list);