import("lib_frame");
import("lib_keyword");

var i;
var id;

//Meldung und Frame schliessen wenn kein Datensatz selektiert werden konnte 
checkRowCount();

// fill data
if (a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
{
    if ( a.hasvar("$image.steps") )
    {
        var step = a.valueofObj("$image.steps");
        for (  i = 0; i < step.length; i++ )
        {
            id = a.addTableRow("$comp.tbl_steps");
            a.updateTableCell("$comp.tbl_steps", id, 2, step[i][0], step[i][0]);
            a.updateTableCell("$comp.tbl_steps", id, 3, step[i][1], step[i][1]);
            a.updateTableCell("$comp.tbl_steps", id, 4, step[i][2],date.longToDate( step[i][2], "dd.MM.yyyy") );
            a.updateTableCell("$comp.tbl_steps", id, 5, step[i][3],date.longToDate( step[i][3], "dd.MM.yyyy") );
            a.updateTableCell("$comp.tbl_steps", id, 6, step[i][4], getKeyName(step[i][4], "KampStufStat"));
            a.updateTableCell("$comp.tbl_steps", id, 7, step[i][5], getKeyName(step[i][5], "OrgMedium"));
            a.updateTableCell("$comp.tbl_steps", id, 8, step[i][6], step[i][6]);
            a.updateTableCell("$comp.tbl_steps", id, 9, step[i][7], step[i][7]);
            a.updateTableCell("$comp.tbl_steps", id, 10, step[i][8], step[i][8]);
        }
    }
    if ( a.hasvar("$image.costs") )
    {
        var cost = a.valueofObj("$image.costs");
        for ( i = 0; i < cost.length; i++ )
        {
            id = a.addTableRow("$comp.tbl_campaigncost");
            a.updateTableCell("$comp.tbl_campaigncost", id, 1, cost[i][0], getKeyName(cost[i][0], "KampKosten"));
            a.updateTableCell("$comp.tbl_campaigncost", id, 2, cost[i][1], cost[i][1]);
        }
    }

    if ( a.hasvar("$image.DefaultValues") )
    {
        a.setValues(a.valueofObj("$image.DefaultValues"));
    }
}