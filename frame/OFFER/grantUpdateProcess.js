import("lib_grant");

// Recht für Ändern
var grant = isgranted( "edit", a.valueof("$comp.idcolumn"));

var role = tools.hasRole(a.valueof("$sys.user"), "PROJECT_Fachadministrator");
a.rs((grant &&  a.valueof("$comp.cmb_Status") < "2" ) || role);
