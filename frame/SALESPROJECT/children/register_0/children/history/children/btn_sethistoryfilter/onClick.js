import("lib_history");

setHistoryCondition(a.valueof("$comp.SALESPROJECTID"));
a.refresh("$comp.Table_history");
a.refresh("$comp.btn_resetHistoryFilter");