import("lib_event");

setParticipantsCondition(a.valueof("$comp.idcolumn"));
a.refresh("$comp.tbl_participants");
a.refresh("$comp.btn_resetPartFilter");