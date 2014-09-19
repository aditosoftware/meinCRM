import("lib_keyword");
import("lib_frame");

var frameid = a.valueof("$comp.cbx_object");
var list = new Array();
if ( frameid != "")
{
    var fd = new FrameData();
    var keyword = fd.getData("id", frameid, ["keyword"] );
    if ( keyword != "" )	list = getValueList(keyword);
}
"$sys.workingmode"; // für Prozessausführung bei Workingmodeänderung
a.ro(list);