var objrelid = a.decodeMS(a.valueof("$comp.relTree"))[1];
var reldesc = a.valueof("$comp.ObjRelInfo");
var spalten = [ "RELDESC", "USER_EDIT", "DATE_EDIT" ];
var werte = [ reldesc, a.valueof("$sys.user"), a.valueof("$sys.date") ];
var typen = a.getColumnTypes( "OBJECTRELATION", spalten );
a.sqlUpdate("OBJECTRELATION", spalten, typen, werte, "OBJECTRELATIONID = '" + objrelid + "'" );
a.refresh("$comp.relTree");