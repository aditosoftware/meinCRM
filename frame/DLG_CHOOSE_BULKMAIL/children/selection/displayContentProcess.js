import("lib_grant");

// Leserechte holen
var condition = getGrantCondition("BULKMAIL_DEFINITION", "SENTDATE IS NULL", "", "EDIT" );
a.rq ("select BULKMAILDEFID, MAILINGNAME, MAILINGDESC from BULKMAILDEF where " + condition + " order by MAILINGNAME");