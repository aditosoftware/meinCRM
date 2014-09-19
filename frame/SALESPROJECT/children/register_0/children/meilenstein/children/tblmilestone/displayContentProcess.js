import("lib_keyword");

var pid = a.valueof("$comp.SALESPROJECTID");
var list = [];
if (pid != "") 
{
    var sql = "select SPCYCLEID, ENTRYDATE, " + getKeySQL("SPPHASE", "KEYVAL") + " from SPCYCLE "
    	+ " where SALESPROJECT_ID = '" + pid + "' and  STATUSPHASE = 'Phase' order by ENTRYDATE desc";
    list = a.sql(sql, a.SQL_COMPLETE);
}

a.ro(list);