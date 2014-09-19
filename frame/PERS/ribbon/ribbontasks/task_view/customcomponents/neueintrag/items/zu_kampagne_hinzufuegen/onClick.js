import("lib_campaign");
var relationid = a.valueof("$comp.relationid");

var campaignid = chooseCampaign();
if ( a.sql("select count(*) from CAMPAIGNPARTICIPANT where RELATION_ID = '" + relationid + "' and CAMPAIGN_ID = '" + campaignid + "'") == 0 )
{
	addParticipants( [relationid], campaignid );
	a.refresh("$comp.Tabelle_modul");
}