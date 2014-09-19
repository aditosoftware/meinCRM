import("lib_sql");

var distlistid = a.valueof("$comp.distlistid");
var query = a.EMPTY_TABLE_SQL;

if (distlistid != "")
{
    query = "select DISTLISTMEMBERID, case when (select count(*) from COMMRESTRICTION where RELATION_ID = RELATION.RELATIONID) > 0 or "
        + " (select count(*) from COMMRESTRICTION join RELATION R on RELATION_ID = R.RELATIONID where R.ORG_ID = ORG.ORGID  and R.PERS_ID is null) > 0 then 1 else 0 end, "
        + " ORGNAME, "	+ concat(["SALUTATION", "FIRSTNAME", "LASTNAME"]) + ", ADDRESS.ZIP, ADDRESS.CITY, relation.reltitle"
        + " from distlistmember left join relation on (relation.relationid = distlistmember.relation_id) "
        + " join ADDRESS on RELATION.ADDRESS_ID = ADDRESS.ADDRESSID "
        + " left join org on (org.orgid = relation.org_id) left join pers on (pers.persid = relation.pers_id) "
        + " where distlistmember.distlist_id = '" + distlistid 	+ "' order by ORGNAME";
}
a.returnquery(query);