import("lib_history");

setHistoryCondition(a.valueof("$comp.persid"));
a.refresh("$comp.Table_history");
a.refresh("$comp.btn_resetHistoryFilter");
a.setValue("$comp.Label_history_filter", setLabelHistoryCondition());