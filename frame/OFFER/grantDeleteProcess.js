import("lib_grant");

var grant = isgranted( "delete", a.valueof("$comp.idcolumn"));  // Recht für Löschen

a.rs(grant && a.valueof("$comp.cmb_Status") == "");