import("lib_history");

var persid = a.valueof("$comp.persid");

var RowIDs = "";
if (persid != "")
{
    RowIDs = a.sql("select RELATIONID from RELATION where PERS_ID = '" + persid + "'", a.SQL_COLUMN);	
    RowIDs = RowIDs.join("', '");
}
if (RowIDs != "")
    a.ro(HistoryTable([RowIDs], [2, 3], computeHistoryCondition()));
else 
    a.ro([]);