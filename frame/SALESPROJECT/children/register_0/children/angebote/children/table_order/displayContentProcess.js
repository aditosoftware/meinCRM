import("lib_keyword")

var id = a.valueof("$comp.idcolumn");
if (id != "") 
{
	a.rq("select SALESORDERID, ORDERCODE, " + getKeySQL( "ORDERTYPE", "ORDERTYPE" ) + ", ORDERDATE, SENT, "
		+ "(select sum(PRICE * QUANTITY) from ORDERITEM where SALESORDER_ID = SALESORDER.SALESORDERID), CURRENCY "
		+ " from SALESORDER join relation on (SALESORDER.RELATION_ID = RELATIONID) join org on (relation.org_id = org.orgid) "
		+ " where PROJECT_ID = '" + id + "'");
} 
else
 a.rq(a.EMPTY_TABLE_SQL);