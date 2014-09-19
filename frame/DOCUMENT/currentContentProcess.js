import("lib_keyword")

var aotype = a.valueof("$comp.AOTYPE");
var name = a.valueof("$comp.NAME");
if (name != '' && aotype != '')
    a.rs( name + "/"  + getKeyName( aotype, "DokArt"));