import("lib_frame");
import("lib_keyword");

//Meldung und Frame schliessen wenn kein Datensatz selektiert werden konnte 
checkRowCount();

// Vorbelegung COMM-Daten für Telefon und Email
if (a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
{
    if ( a.hasvar("$image.comm") )
    {
        var comm = a.valueofObj("$image.comm");
        for ( var i = 0; i < comm.length; i++ )
        {
            var id = a.addTableRow("$comp.Table_comm");
            a.updateTableCell("$comp.Table_comm", id, 2, comm[i][1], getKeyName(comm[i][1], "PersMedium"));
            a.updateTableCell("$comp.Table_comm", id, 3, comm[i][0], comm[i][0]);
        }
    }   
}