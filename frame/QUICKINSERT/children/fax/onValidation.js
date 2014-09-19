import("lib_validation")

var comp = "$comp.fax"
var adresse = a.valueof(comp);
if ( adresse != "" )
{
    adresse = doCommValidation( "fax", adresse, a.valueof("$comp.country"));
    a.setValue(comp, adresse);
}