import("lib_timetracking");
import("lib_frame");

InsertTime( new FrameData().getData("table", a.valueof("$sys.currentimagename"), ["id"]), a.valueof("$comp.idcolumn") )

a.refresh("$comp.tbl_timetrack");