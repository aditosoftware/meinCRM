import("lib_calendar");

var frame = a.valueof("$sys.currentimagename");
var dbid = a.valueof("$comp.idcolumn");

var rettask = (getLinkedToDos (frame, dbid)).length;
	if (rettask == undefined) rettask = 0;

a.rs(a.translate("A&ufgaben (%0)", [rettask]));