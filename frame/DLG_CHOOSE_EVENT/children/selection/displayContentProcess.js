import("lib_grant");

// Leserechte holen
var condition = getGrantCondition("EVENT", "", undefined, "EDIT" );
if(condition != "")	condition = " where " + condition;
a.rq ("select EVENTID, TITLE, DESCRIPTION from EVENT " + condition + " order by TITLE");