import("lib_sql");
import("lib_keyword");
import("lib_grant");


var orgid = a.valueof("$comp.orgid");

if (orgid != "") 
{
    // Leserechte holen
	 
    var condition = getGrantCondition( "PERS", "RELATION.ORG_ID = '" + orgid + "'", "RELATION.RELATIONID" )
    if(condition != "")
    {
        condition = " where " + condition;
    }
    a.rq("select RELATIONID , case "
        + " when RELATION.STATUS = 1 then -16777216 when RELATION.STATUS = 2 then -3355444 else -3407872 end, "
        + " SALUTATION , PERS.TITLE , FIRSTNAME , LASTNAME, DEPARTMENT, "
        + " RELTITLE, RELPOSITION from RELATION inner join PERS on RELATION.PERS_ID = PERS.PERSID"
        + condition + " order by RELATION.STATUS, LASTNAME, FIRSTNAME");
		
}	
else
    a.rq(a.EMPTY_TABLE_SQL);