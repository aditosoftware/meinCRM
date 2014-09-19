var participants = a.decodeMS(a.valueof("$comp.tbl_participants"));
var id = a.valueof("$comp.idcolumn");
if (id != '' && participants != '')
{
    var condition = "";
    var total = a.sql("select count(eventparticipantid) from eventparticipant join relation "
        + " on (relationid = relation_id) where relationid in "
        + " (select relationid from relation where pers_id is not null) and event_id = '" + id + "' " + condition);
    a.rs(a.translate("%0" + " " + "Teilnehmer von" + " " + "%1" + " " + "markiert", [participants.length, total]));
}