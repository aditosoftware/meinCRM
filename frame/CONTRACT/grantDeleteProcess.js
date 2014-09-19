import("lib_grant");
import("lib_frame");

var id = a.valueof("$comp.idcolumn");
var historie = a.sql("select count(*) from HISTORYLINK where OBJECT_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'");

if (historie > 0)
{
    a.rs("false");
}
else
{
    // Recht für Löschen
    a.rs( isgranted( "delete", id));
}