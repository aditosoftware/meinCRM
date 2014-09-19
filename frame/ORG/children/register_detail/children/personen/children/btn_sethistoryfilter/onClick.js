import("lib_history");

setHistoryCondition();
a.refresh("$comp.Table_history");
a.refresh("$comp.btn_resetHistoryFilter");
a.setValue("$comp.Label_history_filter", setLabelHistoryCondition(a.valueof("$comp.Label_Histtoryof")));