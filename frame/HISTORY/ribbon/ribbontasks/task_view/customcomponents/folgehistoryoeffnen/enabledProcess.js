var count = a.sql("select count(*) from HISTORY where HISTORY_ID = '" + a.valueof("$comp.historyid") + "'");
a.rs( a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW && count > 1 );