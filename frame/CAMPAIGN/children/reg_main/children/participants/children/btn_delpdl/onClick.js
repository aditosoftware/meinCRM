import("lib_campaign");

var campaignid = a.valueof("$comp.campaignid");
var distlistid = a.valueof("$comp.lup_distlist");

if ( deleteParticipantsWithCondition("DISTLIST", "DISTLIST_ID = '" + distlistid + "'", campaignid) > 0 )
{
    a.setValue("$comp.lup_distlist", "");
    a.refresh("$comp.tbl_participants");
    a.refresh("$comp.Label_number_of_participants");
}