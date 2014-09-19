import("lib_validation")

var comp = "$comp.url"
var adresse = a.valueof(comp);
if ( adresse != "" )
{
    adresse = doCommValidation( "www", adresse);
    a.setValue(comp, adresse);
}