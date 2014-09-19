import("lib_event");

var id = a.valueof("$comp.idcolumn");
var distlistid = a.valueof("$comp.lup_distlist");

if ( deleteParticipantsWithConditionEvent("DISTLIST", "DISTLIST_ID = '" + distlistid + "'", id) > 0 )
{
    a.setValue("$comp.lup_distlist", "");
    a.refresh("$comp.tbl_participants");
    a.refresh("$comp.Label_number_of_participants");
}