import("lib_campaign");
import("lib_history");

var mitarbeiter;
var relids = getRelationIDs();

if (relids)
{
    mitarbeiter = a.askUserQuestion(a.translate("Welchem Mitarbeiter möchten Sie die Teilnehmer zuordnen?"), "DLG_EMPLOYEE");

    if (mitarbeiter != null)
    {
        var CampaignID = a.valueof("$comp.campaignid");
        var spalten = new Array("employee_relation_id");
        var typen = a.getColumnTypes("campaignparticipant", spalten);
        var werte = [ mitarbeiter["DLG_EMPLOYEE.employee_relation"] ];
        for(var i = 0; i < relids.length; i++)
        {
            a.sqlUpdate("CAMPAIGNPARTICIPANT", spalten, typen, werte, "CAMPAIGN_ID = '" + CampaignID + "' and RELATION_ID = '" + relids[i] + "'");
        }
        mitarbeiter = a.sql("select " + concat(["lastname", "firstname"])
            + " from pers join relation on (pers.persid = relation.pers_id) where relationid = '" + werte[0] + "'");
														
        // HISTORY- und HISTORYLINK-Eintrag erzeugen je nach app.silentHistoryCampaign mit/ohne Aufpoppen von History
        var campaign = a.valueof("$comp.name");
        if ( a.valueof("$global.silentHistoryCampaign") == 'false' )
            InsertHistory( relids, "Intern", "o", "Kampagne", a.translate("Zuständiger Mitarbeiter %0 in Kampagne %1 gesetzt", [mitarbeiter, campaign])
                , [[CampaignID, "6"]] );
        else
            newMultiHistory(werte[0], "9", "o", "Kampagne", a.translate("Zuständiger Mitarbeiter %0 in Kampagne %1 gesetzt", [mitarbeiter, campaign])
                , [[CampaignID, "6"]], relids)
    }
    a.refresh("$comp.tbl_participants");
}