import("lib_history");

resetHistoryCondition();
a.refresh("$comp.Table_history");
a.setValue("$comp.Label_history_filter", setLabelHistoryCondition(a.valueof("$comp.Label_Histtoryof")));
a.refresh("$comp.btn_resetHistoryFilter");