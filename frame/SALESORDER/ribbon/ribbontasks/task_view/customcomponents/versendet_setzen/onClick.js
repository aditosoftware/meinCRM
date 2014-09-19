// Beleg auf versendet setzen
var col = ["SENT"];
var typ = a.getColumnTypes("AO_DATEN", "SALESORDER", col);
a.sqlUpdate("SALESORDER", col, typ, ["Y"], "SALESORDER.SALESORDERID = '" + a.valueof("$comp.idcolumn") + "'");

a.refresh();