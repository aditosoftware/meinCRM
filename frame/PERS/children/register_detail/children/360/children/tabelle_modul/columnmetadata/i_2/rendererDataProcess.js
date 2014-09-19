var icon = a.valueof("$comp.Tabelle_modul.context");
if(icon != null)
a.rq("SELECT BINDATA FROM ASYS_ICONS WHERE DESCRIPTION = '" + icon + "' AND ICON_TYPE = 'Modul'");