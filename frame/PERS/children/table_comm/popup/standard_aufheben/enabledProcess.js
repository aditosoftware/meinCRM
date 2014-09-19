import("lib_keyword");

var standard = "";
var commid = a.valueof("$comp.Label_comm_dec");
if (commid != "")
{
	standard = a.sql("select STANDARD from comm where commid = '" + commid + "'");
	a.rs( a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT && standard == "1");
}
a.rs(a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT && standard == "1");