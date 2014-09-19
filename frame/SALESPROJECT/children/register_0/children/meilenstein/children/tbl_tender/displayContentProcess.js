var id = a.valueof("$comp.idcolumn");
var list = [];

if (id != "")
	list = a.sql("select SPTENDERID, ENTRYDATE, LOGIN, DELIVERYDATE, SENDDATE, INFO "
		+ " from SPTENDER join EMPLOYEE on RELATION_ID = RESPONSIBLE_ID where SALESPROJECT_ID = '" + id + "' order by ENTRYDATE desc", a.SQL_COMPLETE);
a.ro(list);