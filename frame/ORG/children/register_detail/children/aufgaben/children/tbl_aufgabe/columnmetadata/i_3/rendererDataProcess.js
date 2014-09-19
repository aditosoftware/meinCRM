var count = a.valueof("$comp.tbl_Aufgabe.context");
var icon = (count > 1 ? "gruppentermin" : "einzeltermin");
a.rq("SELECT BINDATA FROM ASYS_ICONS WHERE DESCRIPTION = '" + icon + "' AND ICON_TYPE = 'termine_aufgaben'");