import("lib_grant");

// Leserechte holen
a.rs( getGrantCondition(a.valueof("$sys.currentimagename"), "HISTORY_ID is null or HISTORY_ID = HISTORYID" ));