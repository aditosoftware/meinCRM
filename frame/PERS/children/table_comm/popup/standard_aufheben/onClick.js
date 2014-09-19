import("lib_keyword");

var commid = a.valueof("$comp.Label_comm_dec");

//zurücksetzen des Standardflags auf 0 für alle Relationen der Person
var spalte = new Array("standard");
var typen = a.getColumnTypes( "COMM", spalte);
a.sqlUpdate("COMM", spalte, typen, new Array("0"), "COMMID = '" + commid + "'");
a.refresh("$comp.Table_comm");