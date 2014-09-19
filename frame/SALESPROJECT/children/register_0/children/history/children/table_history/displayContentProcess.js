import("lib_history");
import("lib_relation");


//wenn keine Person markiert ist und der Filter "alles" nicht gesetzt ist,
//werden alle Historien angezeigt die mit dem Vertriebsprojekt verknüpft sind
var ObjectID = a.valueof("$image.FrameID"); 
var RowID = a.valueof("$comp.idcolumn");


//wenn der Filter "alle" gesetzt ist, werden alle Historien des Hauptkunden angezeigt
if (a.valueof("$comp.chk_allhistory") == "Y")
{
    RowID = a.valueof("$comp.RELATION_ID");
    ObjectID = "1";
}
else
{
    var spmember = a.sql("select RELATION_ID from SPMEMBER where SPMEMBERID = '" + a.decodeFirst(a.valueof("$comp.tblTeam")) + "'");

    if ( spmember != "") 
    {    
	RowID = spmember;                   //wenn eine Person markiert ist werden alle Historien angezeigt,
        ObjectID = getRelationType(RowID);  //die mit der Person verknüpft sind
    }                                         
}

if (RowID != "")
    a.ro(HistoryTable([RowID], [ObjectID], computeHistoryCondition()));
else
    a.ro([]);
