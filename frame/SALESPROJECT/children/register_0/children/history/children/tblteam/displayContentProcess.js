import("lib_grant");
import("lib_keyword");
import("lib_sql");

var pid = a.valueof("$comp.SALESPROJECTID");
if (pid != "")
{
    // Leserechte holen
	 
    var condition = getGrantCondition( "PERS", "", "RELATION.RELATIONID" )
    if (condition != "")	condition = " and " + condition;
    var sql = "select SPMEMBERID, " 
    + concat(["SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME"]) + ", " + getKeySQL( "SPROLE", "SPMEMBER.SALESPROJECTROLE" )
    + ", DEPARTMENT, RELTITLE, RELPOSITION, ORGNAME" 
    + " from SPMEMBER join RELATION on (SPMEMBER.RELATION_ID = RELATION.RELATIONID) "
    + " join ORG on (RELATION.ORG_ID = ORG.ORGID) join PERS on (RELATION.PERS_ID = PERS.PERSID) "
    + " where SALESPROJECT_ID = '" + pid + "'" + condition;

    var list = a.sql(sql, a.SQL_COMPLETE);
		
    a.ro(list);
}