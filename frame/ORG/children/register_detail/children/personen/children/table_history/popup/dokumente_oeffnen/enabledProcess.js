import("lib_document");
count = countHistoryDocument( a.valueof("$comp.Label_history_dec") );
a.rs (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW && count > 0 );