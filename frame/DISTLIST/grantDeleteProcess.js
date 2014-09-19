import("lib_grant");


var idcolumn = a.valueof("$comp.idcolumn");
var teilnehmer = a.sql("select count(*) from distlistmember where distlist_id = '" + a.valueof("$comp.idcolumn") + "'");
if (teilnehmer > 0 )
{
    a.rs("false");
}
else
{
    // Recht für Löschen
    a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
}