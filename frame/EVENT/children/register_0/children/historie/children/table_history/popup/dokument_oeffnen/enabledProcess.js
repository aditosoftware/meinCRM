import("lib_document");
a.rs(false);
count = countHistoryDocument( a.decodeFirst(a.valueof("$comp.Table_history")));
a.rs (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW && count > 0 );