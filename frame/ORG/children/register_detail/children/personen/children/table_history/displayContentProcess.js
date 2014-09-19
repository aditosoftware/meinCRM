import("lib_history");

var RowID = a.decodeFirst(a.valueof("$comp.Table_pers"));
var ObjectID = '3'; // Funktion
if ( RowID == "")
{
    RowID = a.valueof("$comp.relationid");
    ObjectID = '1'; // Org
}
if (RowID != '')
    a.ro(HistoryTable([RowID], [ObjectID], computeHistoryCondition()));
else 
    a.ro([]);