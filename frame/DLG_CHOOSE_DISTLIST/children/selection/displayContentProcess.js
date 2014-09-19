import("lib_grant");

// Leserechte holen
var condition = getGrantCondition("DISTLIST", "", undefined, "EDIT" );
if(condition != "")	condition = " where " + condition;
a.rq ("select DISTLISTID, NAME, DESCRIPTION from DISTLIST " + condition + " order by NAME");