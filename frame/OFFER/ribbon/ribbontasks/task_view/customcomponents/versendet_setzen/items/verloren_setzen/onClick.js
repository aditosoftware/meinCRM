// Angebot auf verloren setzen
var col = ["STATUS"];
var typ = a.getColumnTypes("AO_DATEN", "OFFER", col);
a.sqlUpdate("OFFER", col, typ, ["4"], "OFFERID = '" + a.valueof("$comp.idcolumn") + "'");

a.refresh();