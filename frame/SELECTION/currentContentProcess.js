import("lib_frame");

var frameid =  a.valueof("$comp.FRAMEID");
if ( frameid != "" )
{
    var fd = new FrameData();
    var res = fd.getData("id", frameid, ["title"]);

    a.rs(a.translate(res[0][0]) + " / " + a.valueof("$comp.NAME"));
}