import("lib_calendar");

var frame = a.valueof("$sys.currentimagename");
var dbID = a.valueof("$comp.idcolumn");

a.ro(getLinkedEvents (frame, dbID));