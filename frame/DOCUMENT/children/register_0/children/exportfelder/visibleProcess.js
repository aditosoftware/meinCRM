import("lib_keyword");

var aotype = a.valueof("$comp.AOTYPE");
var exp = getKeyValue( "Exportvorlage", "DokArt" )
var sbr = getKeyValue( "Serienbriefvorlage", "DokArt" )

a.rs(aotype == exp || aotype == sbr)