import("lib_history");

var condition = "";
var framecondition = a.valueof("$sys.selection"); 
if (framecondition != "") condition = " where " + framecondition;
var relids = a.sql("select RELATIONID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID join ORG on (RELATION.ORG_ID = ORG.ORGID) " + condition, a.SQL_COLUMN);
if ( relids.length > 0 )
{
    InsertHistory( relids );
}