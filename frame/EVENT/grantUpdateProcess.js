import("lib_grant");

a.rs((a.valueof("$comp.EVENTSTATUS") < 3 || tools.hasRole(a.valueof("$sys.user"), "PROJECT_Fachadministrator")) && isgranted( "edit", a.valueof("$comp.idcolumn")));