import("lib_keyword");

var id = a.valueof("$comp.idcolumn");
var statusphase = a.valueof("$comp.cmb_statusphase_admin");
if (statusphase != '') statusphase = "and STATUSPHASE = '" + statusphase + "'";
var list =[];
if (id != '')
{
	var sql = "select SPCYCLEID, ENTRYDATE, STATUSPHASE, case when STATUSPHASE = 'Status' then " 
		+ getKeySQL("SPSTATUS", "KEYVAL") + " else " + getKeySQL("SPPHASE", "KEYVAL") + " end, DAYS "
		+ " from SPCYCLE where SALESPROJECT_ID = '" + id + "'" + statusphase + " order by ENTRYDATE desc";
	list = a.sql(sql, a.SQL_COMPLETE);
}
a.ro(list);