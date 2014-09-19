var ids = a.valueofObj("$local.idvalue");
var sqlstr = "select HISTORY_THEMEID, THEME_ID, THEME from HISTORY_THEME where ";
var histid = a.valueof("$comp.idcolumn");

if ( ids == "undefined" && histid != "")  sqlstr += "HISTORY_ID = '" + histid + "'";
else  sqlstr += "HISTORY_THEMEID in ('" + ids.join("','") + "')";

a.ro( a.sql(sqlstr,a.SQL_COMPLETE) );