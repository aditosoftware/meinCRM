import("lib_relation");

var id = a.valueof("$comp.eventtree");
if (id != a.valueof("$comp.EVENTID") )
{
    if ( a.valueof("$global.upwardLink") == "link")
        a.openLinkedFrame("EVENT", "EVENTID = '" + id + "'", false, a.FRAMEMODE_SHOW, "");
    else
        a.openFrame("EVENT", "EVENTID = '" + id + "'", false, a.FRAMEMODE_SHOW);
}