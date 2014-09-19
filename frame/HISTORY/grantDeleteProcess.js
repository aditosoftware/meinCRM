import("lib_grant");

// Recht für Löschen
var count = a.sql("select count(*) from HISTORY where HISTORY_ID = '" + a.valueof("$comp.historyid") + "' and HISTORYID <> HISTORY_ID")
a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")) && count == 0);