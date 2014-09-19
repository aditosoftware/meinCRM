import("lib_frame");
import("lib_history");

// Meldung und Frame schliessen wenn kein Datensatz selektiert werden konnte 
checkRowCount();

// fill historylink data
if (a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
{
    if ( a.hasvar("$image.toLink") )
    {
        var fd = new FrameData();
        var toLink = a.valueofObj("$image.toLink");	
        var datum = a.valueof("$sys.date");
        var user = a.valueof("$sys.user");
        var historyid = a.valueof("$comp.historyid"); 
        var toLinklength = toLink.length;
        if ( toLink.length > 10 ) 
        {
            toLinklength = 10;
            a.imagevar("$image.toLinklength", toLinklength);
        }
        for (var i=0; i < toLinklength; i++)
        {
            var uid = a.addTableRow("$comp.Tabelle_hlink");
            a.updateTableCell("$comp.Tabelle_hlink", uid, 1, toLink[i][1], a.translate( fd.getData("id", toLink[i][1], ["title"]) ));
            a.updateTableCell("$comp.Tabelle_hlink", uid, 2, toLink[i][0], a.sql(GetLinkFields( toLink[i][1], "'" + toLink[i][0] + "'" )));
        }
    }
    if ( a.hasvar("$image.DefaultValues") )
    {
        a.setValues(a.valueofObj("$image.DefaultValues"));
    }
}