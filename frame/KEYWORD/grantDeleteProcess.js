import("lib_grant");
var type  = a.valueof("$comp.keyvalue");
var anz = 0;
if (type != "")		anz = a.sql("select count(*)  from KEYWORD where KEYTYPE = " + type);

if (anz > 0 )
{
    a.rs("false");
}
else
{
    // Recht für Löschen
    a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
}