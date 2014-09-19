var value = a.valueof("$comp.department");
if ( value.length > 50 ) a.rs(a.translate("Maximal %0 Zeichen erlaubt", ["50"]));