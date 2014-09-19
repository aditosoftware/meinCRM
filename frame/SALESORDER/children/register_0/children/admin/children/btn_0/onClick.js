// Beleg versendet raus
var col = ["SENT"];
var typ = a.getColumnTypes("AO_DATEN", "SALESORDER", col)
a.sqlUpdate("SALESORDER", col, typ, ["N"], "SALESORDER.SALESORDERID = '" + a.valueof("$comp.idcolumn") + "'")

a.refresh()