import("lib_campaign");
/*
Da es möglich sein muss die Befragung auch vorzeitig zu beenden, ist dafür ein extra Button vorhanden
z.B. Kunde hat keine Lust mehr und möchte auch nicht später weiter machen
*/

var cip = a.valueof("$comp.edt_campaignparticipant");
if (cip != '')
{
    var questionnaireid = a.valueof("$comp.QUESTIONNAIRELOGID");
    var relids = new Array(a.valueof("$comp.RELATION_ID"));
    var campaigninfo = a.sql("select CAMPAIGN_ID, NAME"
        + " from CAMPAIGNPARTICIPANT join CAMPAIGN on (CAMPAIGNPARTICIPANT.CAMPAIGN_ID = CAMPAIGN.CAMPAIGNID)"
        + " where CAMPAIGNPARTICIPANTID = '" + cip + "'", a.SQL_ROW);
								
    var campaignid = campaigninfo[0];
    var campaignname = campaigninfo[1];

    //Stufe wählen lassen
    var stepid = selectCampaignStep(campaignid);
    if (stepid != null)
    {
        //Stufe setzen
        setCampaignStep(campaignid, stepid, relids);
        var stufe = a.sql("SELECT STEP from CAMPAIGNSTEP where CAMPAIGNSTEPID = '" + stepid + "'");
    }
}

//Frame schließen
a.closeCurrentTopImage();