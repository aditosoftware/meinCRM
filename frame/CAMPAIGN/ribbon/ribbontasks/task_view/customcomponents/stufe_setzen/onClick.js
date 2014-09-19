import("lib_campaign");
import("lib_history");


var relids = getRelationIDs();

if (relids)
{
    var CampaignID = a.valueof("$comp.campaignid");
    var stepid = selectCampaignStep(CampaignID);
    if (stepid != null)
    {
        setCampaignStep(CampaignID, stepid, relids);
        // HISTORY- und HISTORYLINK-Eintrag erzeugen je nach app.silentHistoryCampaign mit/ohne Aufpoppen von History
        var stufe = a.translate(a.sql("select step from campaignstep where campaignstepid = '" + stepid + "' order by code"));
        var campaign = a.valueof("$comp.name")
        if ( a.valueof("$global.silentHistoryCampaign") == 'false' )
            InsertHistory( relids, "Intern", "o", "Kampagne", a.translate("Stufe '%0' in Kampagne '%1' gesetzt.", [stufe, campaign ])
                , [[CampaignID, "6"]] );
        else
            newMultiHistory( a.valueof("$global.user_relationid"), "9", "o", "Kampagne", a.translate("Stufe '%0' in Kampagne '%1' gesetzt.", [stufe, campaign ])
                , [[CampaignID, "6"]], relids)
    }
    a.refresh("$comp.tbl_participants");
}