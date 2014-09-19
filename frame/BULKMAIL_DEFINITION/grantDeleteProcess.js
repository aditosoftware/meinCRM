import("lib_grant");

var idcolumn = a.valueof("$comp.idcolumn");
var teilnehmer = a.sql("select count(*) from BULKMAILRCPT where BULKMAILDEF_ID = '" + idcolumn + "'");

if (teilnehmer > 0)
{
    a.rs("false");
}
else
{
    // Recht für Löschen
    a.rs( isgranted( "delete",  idcolumn));

}