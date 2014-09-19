import("lib_event");

var participants = a.decodeMS(a.valueof("$comp.tbl_participants"));
var del = deleteParticipantsWithConditionEvent( "", "EVENTPARTICIPANTID in ('" + participants.join("','")  + "')", a.valueof("$comp.idcolumn" ))
if ( del > 0 )
{
    a.refresh("$comp.tbl_participants");
    a.refresh("$comp.Label_number_of_participants");
}