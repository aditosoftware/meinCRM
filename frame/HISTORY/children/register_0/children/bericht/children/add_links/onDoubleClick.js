import("lib_frame");
import("lib_history");

var modulid = a.decodeMS(a.decodeFirst(a.valueof("$comp.add_links")));

if ( modulid.length > 1 )
{
    var fd = new FrameData().getData("name", modulid[2], ["id", "title"] )[0];
    var id = a.addTableRow("$comp.Tabelle_hlink");
    a.updateTableCell("$comp.Tabelle_hlink", id, 1, fd[0], fd[1]);
    a.updateTableCell("$comp.Tabelle_hlink", id, 2, modulid[0], a.sql(GetLinkFields( fd[0], "'" + modulid[0] + "'")));
}