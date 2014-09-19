import("lib_keyword");

var attrid = a.valueof("$comp.attrid");
var list = "";
if (attrid != "") 
{
    list =	a.sql("select ATTROBJECTID, ATTROBJECT, MINCOUNT, MAXCOUNT, KEYVALUE "
        + " from ATTROBJECT where ATTR_ID = '" + attrid + "'", a.SQL_COMPLETE);
}
if (list.length == 0) list = a.createEmptyTable(5)
a.returnobject( list );