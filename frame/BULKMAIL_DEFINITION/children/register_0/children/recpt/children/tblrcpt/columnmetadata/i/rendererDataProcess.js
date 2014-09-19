var icon = a.valueof("$comp.tblRcpt.context");
if(icon != null)
    a.rq("SELECT BINDATA FROM ASYS_ICONS WHERE DESCRIPTION = '" + icon + "' AND ICON_TYPE = 'Werbeeinschränkung'");