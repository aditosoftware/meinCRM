var condition = "";
var framecondition = a.valueof("$sys.selection"); 
if (framecondition != "") condition = " where " + framecondition;
ids = a.sql("select ORGID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID join ORG on (RELATION.ORG_ID = ORG.ORGID) " + condition, a.SQL_COLUMN);
a.openFrame("PERS", "RELATION.ORG_ID in ('" + ids.join("','") + "')", false, a.FRAMEMODE_TABLE_SELECTION, null, false);