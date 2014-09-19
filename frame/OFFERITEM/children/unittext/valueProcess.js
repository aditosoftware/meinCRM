import("lib_keyword");

var unittext = "";
var unit = a.valueof("$comp.UNIT");
var lang = a.valueof("$comp.edt_language")
if ( unit != "" && lang != "" )
{
    lang = getKeyName(lang, "SPRACHE", "KEYNAME2");
    unittext = getKeyName(unit, "Einheiten", "KEYNAME1", lang);
}
a.rs(unittext);