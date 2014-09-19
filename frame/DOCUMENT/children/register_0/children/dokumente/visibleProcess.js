import("lib_keyword");

var aotype = a.valueof("$comp.AOTYPE");
var exp = getKeyValue( "Exportvorlage", "DokArt" );

a.rs(aotype != exp);