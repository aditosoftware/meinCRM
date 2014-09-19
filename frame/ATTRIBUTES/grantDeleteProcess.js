import("lib_grant");

var id = a.valueof("$comp.attrid");
if ( id != "")
{
    if ( a.sql("select count(*) from ATTRLINK where ATTR_ID = '" + id + "'") > 0 ||  a.sql("select count(*) from ATTR where ATTR_ID = '" + id + "'") != "0" )
    {
        a.rs("false")
    }
    else
    {
        // Recht für Löschen
        a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
    }
}