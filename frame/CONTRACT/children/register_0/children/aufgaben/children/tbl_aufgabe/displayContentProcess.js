import("lib_calendar");

var frame = a.valueof("$sys.currentimagename");
var dbid = a.valueof("$comp.idcolumn");

a.ro(getLinkedToDos (frame, dbid));