var cond = ""; //" where SALESPROJECTID not in ('6028da6f-b8c9-4c4f-a3b2-0c7470d258c9', 'd7fc0b1c-499c-431f-ab0e-b29e202f0f31')";
var sp = a.sql("select SALESPROJECTID, DATE_NEW from SALESPROJECT" + cond, a.SQL_COMPLETE);
var col = ["SPCYCLEID", "SALESPROJECT_ID", "ENTRYDATE", "STATUSPHASE", "KEYVAL", "DAYS", "DATE_NEW", "USER_NEW"];
var typ = a.getColumnTypes("SPCYCLE", col);
var today = a.valueof("$sys.today");
var user = a.valueof("$sys.user");
for (i=0; i<sp.length; i++)
{
	var spcl = a.sql("select count(*) from SPCYCLE where SALESPROJECT_ID = '" + sp[i][0] + "'")
	if (spcl == 0 )
	{
		var diff = eMath.roundInt((today - sp[i][1])/date.ONE_DAY, 0);
		a.sqlInsert("SPCYCLE", col, typ, [a.getNewUUID(), sp[i][0], sp[i][1], 'Status', "1", diff, today, user]);
		a.sqlInsert("SPCYCLE", col, typ, [a.getNewUUID(), sp[i][0], sp[i][1], 'Phase', "1", diff, today, user]);
	}
}

var id = a.valueof("$comp.idcolumn");
var today = a.valueof("$sys.today");
var user = a.valueof("$sys.user");

var cond = " where STATUSPHASE = 'Phase' and SALESPROJECT_ID = '" + id + "'";
var sp = a.sql("select SPCYCLEID, SALESPROJECT_ID, STATUSPHASE, KEYVAL, ENTRYDATE, DAYS from SPCYCLE" + cond + " order by SALESPROJECT_ID, ENTRYDATE", a.SQL_COMPLETE);
for (i=0; i<sp.length - 1; i++)
{
	if (sp[i+1][4] > sp[i][4] )
	var diff = eMath.roundInt(eMath.subInt(sp[i+1][4], sp[i][4])/date.ONE_DAY, eMath.ROUND_HALF_EVEN);
	a.sqlUpdate("SPCYCLE", ["DAYS"], [SQLTYPES.INTEGER], [diff], " SPCYCLEID = '" + sp[i][0] + "'");
}
var diff = eMath.roundInt(eMath.subInt(today, sp[sp.length-1][4])/date.ONE_DAY, eMath.ROUND_HALF_EVEN);
a.sqlUpdate("SPCYCLE", ["DAYS"], [SQLTYPES.INTEGER], [diff], " SPCYCLEID = '" + sp[sp.length-1][0] + "'");

var cond = " where STATUSPHASE = 'Status' and SALESPROJECT_ID = '" + id + "'";
var sp = a.sql("select SPCYCLEID, SALESPROJECT_ID, STATUSPHASE, KEYVAL, ENTRYDATE, DAYS from SPCYCLE" + cond + " order by SALESPROJECT_ID, ENTRYDATE", a.SQL_COMPLETE);
for (i=0; i<sp.length - 1; i++)
{
	if (sp[i+1][4] > sp[i][4] )
	var diff = eMath.roundInt(eMath.subInt(sp[i+1][4], sp[i][4])/date.ONE_DAY, eMath.ROUND_HALF_EVEN);
	a.sqlUpdate("SPCYCLE", ["DAYS"], [SQLTYPES.INTEGER], [diff], " SPCYCLEID = '" + sp[i][0] + "'");
}
var diff = eMath.roundInt(eMath.subInt(today, sp[sp.length-1][4])/date.ONE_DAY, eMath.ROUND_HALF_EVEN);
a.sqlUpdate("SPCYCLE", ["DAYS"], [SQLTYPES.INTEGER], [diff], " SPCYCLEID = '" + sp[sp.length-1][0] + "'");

a.refresh("$comp.tbl_spcycle")