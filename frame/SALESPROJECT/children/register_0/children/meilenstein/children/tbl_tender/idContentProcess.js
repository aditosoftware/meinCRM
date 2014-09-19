var id = a.valueof("$comp.idcolumn");
var list = [];

if (id != "")
	list = a.sql("select SPTENDERID, ENTRYDATE, RESPONSIBLE_ID, DELIVERYDATE, SENDDATE, SENT "
		+ " from SPTENDER", a.SQL_COMPLETE);
a.ro(list);