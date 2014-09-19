import("lib_validation")

var comp = "$comp.email"
var adresse = a.valueof(comp);
if ( adresse != "" )
{
    adresse = doCommValidation( "mail", adresse);
    a.setValue(comp, adresse);
}