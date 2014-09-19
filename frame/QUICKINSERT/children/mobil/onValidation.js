import("lib_validation")

var comp = "$comp.mobil"
var adresse = a.valueof(comp);
if ( adresse != "" )
{
    adresse = doCommValidation( "fon", adresse, a.valueof("$comp.country"));
    a.setValue(comp, adresse);
}