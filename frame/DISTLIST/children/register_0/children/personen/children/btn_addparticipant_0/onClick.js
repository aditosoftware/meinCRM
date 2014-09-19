import("lib_distlist");

var memberids = a.decodeMS(a.valueof("$comp.tbl_distlistmember"))

if ( deleteMembersWithCondition( "", "DISTLISTMEMBERID in ('" + memberids.join("','")  + "')", a.valueof("$comp.distlistid" )) > 0 )
{
    a.refresh("$comp.tbl_distlistmember");
    a.refresh("$comp.label_anz_member");
}