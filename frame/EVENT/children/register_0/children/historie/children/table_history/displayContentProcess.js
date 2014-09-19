import("lib_history");

var RowID = a.valueof("$comp.idcolumn");
if (RowID != '')
    a.ro(HistoryTable([RowID], [a.valueof("$image.FrameID")], computeHistoryCondition()));
else
    a.ro([])