import("lib_event");

var relid   = a.valueof("$comp.lup_relation")
var eventid = a.valueof("$comp.EVENTID");
var adate   = a.valueof("$sys.date");
var charge  = a.valueof("$comp.CHARGE");

if (addParticipantsWithConditionEvent( "", "RELATIONID = '" + relid + "'", eventid, charge, adate, 1, 3, 0 ) > 0)
{
    a.setValue("$comp.lup_relation", "");
    a.refresh("$comp.tbl_participants");
    a.refresh("$comp.Label_number_of_participants");
}
else a.showMessage(a.translate("ist bereits als Teilnehmer eingetragen !"));