var icon = a.valueof("$comp.Table_history.context");
if(icon != null)
a.rq("SELECT BINDATA FROM ASYS_ICONS WHERE DESCRIPTION = '" + icon + "' AND ICON_TYPE = 'History'");