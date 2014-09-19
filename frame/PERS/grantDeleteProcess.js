import("lib_grant");

var persid = a.valueof("$comp.persid");
var relid = a.valueof("$comp.relationid");
var historie = a.sql("select  count(*) from historylink where object_id in (2,3) and row_id = '" + relid + "'");
var employee = a.sql("select count(*) from employee where relation_id = '" + relid + "'");

if ( historie > 0 || employee > 0)
{
    a.rs("false");
}
else
{
    // Recht für Löschen
    a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
}