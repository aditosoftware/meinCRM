import("lib_keyword");

var items = a.sql("select count(*) from ORDERITEM where SALESORDER_ID = '" + a.valueof("$comp.idcolumn") + "'")
var sent = a.valueof("$comp.SENT");
var diff = eMath.addDec(a.valueof("$comp.SUMME_brutto"), -a.valueof("$comp.PAYED"))
var adjust = a.valueof("$comp.ADJUSTMENT");
var cancelled = a.valueof("$comp.CANCELLED");
var ordertype = a.valueof("$comp.ORDERTYPE");

a.rs(items > 0 && sent == 'Y' && diff > 0 && adjust == 'N' && cancelled == 'N' && ordertype == getKeyValue("Rechnung", "ORDERTYPE"));