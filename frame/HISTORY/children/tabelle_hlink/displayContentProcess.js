import("lib_history");
import("lib_frame");

var HistoryID = a.valueof("$comp.idcolumn");
var sql = a.EMPTY_TABLE_SQL;

if (HistoryID != "")
{	
    var fd = new FrameData();
    var objects = fd.getData("history", true, ["id"]); // Frames für Historylink
    objects.push(["1"]);
    objects.push(["2"]);
    objects.push(["3"]);
    var sql1 = "select HISTORYLINKID, case";
    var sql2 =  ", case";
    var sql3 = " '' "
    for ( var i = 0; i < objects.length; i++ )
    {
        // Objectname (FrameID) auflösen
        sql1 += " when OBJECT_ID = " + objects[i][0] + " then '" + fd.getData("id", objects[i][0], ["title"]) + "' \n";
        // Objectbezeichnugen auflösen 
        sql2 += " when OBJECT_ID = " + objects[i][0] + " then " + cast( "(" + GetLinkFields( objects[i][0], "HISTORYLINK.ROW_ID" ) + ")",
            "varchar", 250 ) + " \n";
    }
    sql = sql1 + " end " + sql2 + " end " + " from HISTORYLINK where HISTORY_ID = '" + HistoryID + "'";
}
a.returnquery( sql );