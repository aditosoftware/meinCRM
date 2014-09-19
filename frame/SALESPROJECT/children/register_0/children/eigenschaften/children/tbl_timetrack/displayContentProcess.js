import("lib_frame");

var id = a.valueof("$comp.idcolumn");
var list = [];
var objectid = new FrameData().getData("table", a.valueof("$sys.currentimagename"), ["id"])

if (id != '')
{
	list = a.sql("select TIMETRACKINGID, TRACKINGDATE, USER_NEW, MINUTES, DESCRIPTION "
		+ " from TIMETRACKING where OBJECT_ID = " + objectid + " and ROW_ID = '" + id  + "'", a.SQL_COMPLETE)
}

a.ro(list);