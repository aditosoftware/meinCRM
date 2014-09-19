import("lib_grant");

// Leserechte holen
var condition = getGrantCondition("CAMPAIGN", "", undefined, "EDIT" );
if(condition != "")	condition = " where " + condition;
a.rq ("select CAMPAIGNID, NAME, DESCRIPTION from CAMPAIGN " + condition + " order by NAME");