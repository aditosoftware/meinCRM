import("lib_grant");

// Recht für Ändern
var grant = isgranted( "edit", a.valueof("$comp.idcolumn"));
var sent = a.valueof("$comp.SENT");
var role = tools.hasRole(a.valueof("$sys.user"), "PROJECT_Fachadministrator");
a.rs((grant && sent == 'N') || role);