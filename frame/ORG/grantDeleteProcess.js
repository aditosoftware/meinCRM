import("lib_grant");
import("lib_frame");

var orgid = a.valueof("$comp.orgid");
var relid = a.valueof("$comp.relationid");
var personen = a.sql("select RELATION.RELATIONID from RELATION where PERS_ID is not null and ORG_ID = '" + orgid + "'", a.SQL_COLUMN);
var historie = a.sql("select HISTORYLINK.HISTORYLINKID from HISTORYLINK where OBJECT_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + relid + "'", a.SQL_COLUMN);

if (personen.length > 0 || historie.length > 0)
{
    a.rs("false");
}
else
{
    // Recht für Löschen
    a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
}