import("lib_campaign");

var participants = a.decodeMS(a.valueof("$comp.tbl_participants"));

if ( deleteParticipantsWithCondition( "", "CAMPAIGNPARTICIPANTID in ('" + participants.join("','")  + "')", a.valueof("$comp.campaignid" )) > 0 )
{
    a.refresh("$comp.tbl_participants");
    a.refresh("$comp.Label_number_of_participants");
}