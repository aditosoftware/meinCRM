import("lib_campaign")

var participants = a.decodeMS(a.valueof("$comp.tbl_participants"));
var campaignid = a.valueof("$comp.campaignid");
if (campaignid != '' && participants != '')
{
    var ref = a.valueof("$comp.Liste_step_included") + a.valueof("$comp.chk_laststep") + a.valueof("$comp.employee") + a.valueof("$comp.channel");

    var condition = computeCondition();
    var total = a.sql("select count(campaignparticipantid) from campaignparticipant join relation "
        + " on (relationid = relation_id) where campaign_id = '" + campaignid + "' " + condition);
    a.rs(a.translate("%0" + " "+ "Teilnehmer von" + " " + "%1" + " " + "markiert", [participants.length, total]));
}