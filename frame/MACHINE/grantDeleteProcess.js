import("lib_grant");

var id = a.valueof("$comp.idcolumn");
var historie = a.sql("select count(historylinkid) from historylink where OBJECT_ID = " + a.valueofObj("$image.FrameID") 
    + " and ROW_ID = '" + id + "'");

if ( historie > 0)
{
    a.rs("false");
}
else
{
    // Recht für Löschen
    a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
}