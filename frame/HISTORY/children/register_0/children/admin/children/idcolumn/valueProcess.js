var id = a.valueof("$comp.HISTORY_ID");
if ( id == "" )     id = a.valueof("$comp.historyid");

a.rs( id );