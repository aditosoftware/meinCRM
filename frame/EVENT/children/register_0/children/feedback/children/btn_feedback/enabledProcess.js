import("lib_keyword");

var registered = a.sql("select count(EVENTPARTICIPANTID) from EVENTPARTICIPANT where STATUS = 2");
var eventid = a.valueof("$comp.EVENTID");

if (eventid != '')
{
    var count = a.sql("select count(*) from FEEDBACK where EVENT_ID = '" + eventid + "'");
    a.rs( count == 0 && a.valueof("$comp.cmb_fragebogen") != '' && registered > 0 && a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT);
}
//a.refresh("$comp.btn_feedback");