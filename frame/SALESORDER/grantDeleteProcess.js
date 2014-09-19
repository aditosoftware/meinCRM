import("lib_grant");

var grant = isgranted( "delete", a.valueof("$comp.idcolumn"));  // Recht für Löschen
var sent = a.valueof("$comp.SENT");

a.rs(grant && sent == 'N');