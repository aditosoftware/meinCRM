import("lib_grant");


// Recht für Ändern
var res = isgranted( "edit", a.valueof("$comp.idcolumn"));

a.rs(res);