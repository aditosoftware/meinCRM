import("lib_frame");
import("lib_keyword");
import("lib_sql");

//Meldung und Frame schliessen wenn kein Datensatz selektiert werden konnte 
checkRowCount();

// fill data
if (a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
{
    if ( a.hasvar("$image.positions") )
    {
        var pos = a.valueofObj("$image.positions");
        for ( var i = 0; i < pos.length; i++ )
        {
            var id = a.addTableRow("$comp.tbl_participants");
            a.updateTableCell("$comp.tbl_participants", id, 2, pos[i][0],date.longToDate( pos[i][0], "dd.MM.yyyy") );
            a.updateTableCell("$comp.tbl_participants", id, 3, pos[i][1], getKeyName(pos[i][1], "EVENTPARTSTATUS"));
            a.updateTableCell("$comp.tbl_participants", id, 4, pos[i][2], getKeyName(pos[i][2], "EVENTPARTFUNC"));
            a.updateTableCell("$comp.tbl_participants", id, 5, pos[i][3], a.formatDouble(pos[i][3], "#,##0.00"));
            a.updateTableCell("$comp.tbl_participants", id, 6, pos[i][4], a.formatDouble(pos[i][4], "#,##0.00"));
            var name = a.sql("select " + concat(["TITLE", "FIRSTNAME", "LASTNAME"]) 
                + " from PERS join RELATION on PERSID = PERS_ID where RELATIONID = '" + pos[i][5] + "'");
            a.updateTableCell("$comp.tbl_participants", id, 7, pos[i][5], name);
        }
    }
    if ( a.hasvar("$image.DefaultValues") )
    {
        a.setValues(a.valueofObj("$image.DefaultValues"));
    }
}
//if ( a.hasvar("$image.DefaultValues") )
//{
//		a.setValues(a.valueofObj("$image.DefaultValues"));
//}