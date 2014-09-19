import("lib_frame");
import("lib_keyword");

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
            var id = a.addTableRow("$comp.Table_Items");
            a.updateTableCell("$comp.Table_Items", id, 1, eMath.addInt(i, 1), eMath.addInt(i, 1));
            a.updateTableCell("$comp.Table_Items", id, 2, pos[i][1], pos[i][3] + " / " + pos[i][2]);
            a.updateTableCell("$comp.Table_Items", id, 4, pos[i][4], getKeyName(pos[i][4], "Einheiten"));
            a.updateTableCell("$comp.Table_Items", id, 5, pos[i][5] == "" ? 0 : pos[i][5], a.formatDouble( pos[i][5] == "" ? 0 : pos[i][5], "#,##0.00"));
            a.updateTableCell("$comp.Table_Items", id, 3, pos[i][6] == "" ? 0 : pos[i][6], a.formatDouble( pos[i][6] == "" ? 0 : pos[i][6], "#,##0"));
            a.updateTableCell("$comp.Table_Items", id, 6, pos[i][7] == "" ? 0 : pos[i][7], a.formatDouble( pos[i][7] == "" ? 0 : pos[i][7], "#,##0.00 '%'"));
            a.updateTableCell("$comp.Table_Items", id, 7, pos[i][8] == "" ? 0 : pos[i][8], a.formatDouble( pos[i][8] == "" ? 0 : pos[i][8], "#,##0.00"));
            a.updateTableCell("$comp.Table_Items", id, 8, pos[i][9] == "" ? 0 : pos[i][9], a.formatDouble(pos[i][9] == "" ? 0 : pos[i][9], "#,##0.00 '%'"));
            a.updateTableCell("$comp.Table_Items", id, 9, pos[i][10], pos[i][10]);	
        }
    }
    if ( a.hasvar("$image.DefaultValues") )
    {
        a.setValues(a.valueofObj("$image.DefaultValues"));
    }
}