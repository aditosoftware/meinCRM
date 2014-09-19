import("lib_history");

setHistoryCondition(a.valueof("$comp.idcolumn"));
a.refresh("$comp.Table_history");
a.refresh("$comp.btn_resetHistoryFilter");