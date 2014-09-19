import("lib_campaign");

var relid = a.valueof("$comp.lup_relation");
var campid = a.valueof("$comp.campaignid");
var isparticipant = a.sql("select count(*) from CAMPAIGNPARTICIPANT where RELATION_ID = '" 
    + relid + "' and CAMPAIGN_ID = '" + campid + "'");

if (isparticipant == 0 && addParticipants( [relid], campid ) > 0)
{
    a.setValue("$comp.lup_relation", "");
    a.refresh("$comp.tbl_participants");
    a.refresh("$comp.Label_number_of_participants");
}
else a.showMessage(a.translate("ist bereits als Teilnehmer eingetragen !"))