import("lib_keyword");

var campaignid = a.valueof("$comp.campaignid");
var table = a.createEmptyTable(2);
var list = [];
var costlist = [];
var fixkost = 0;
var varkost = 0;
if (campaignid != "") 
{
    table = a.sql("select sum(NET), CAMPAIGN_ID from CAMPAIGNCOST "
        + " where CAMPAIGN_ID = '" + campaignid + "' group by CAMPAIGN_ID", a.SQL_COMPLETE);
    costlist = a.sql("select step, cost, count(campaignlog.step_id) from campaignlog "
        + " join campaignstep on step_id = campaignstepid where campaignlog.campaign_id = '" + campaignid 
        + "' and COST is not null group by campaignstepid, step, cost", a.SQL_COMPLETE);
    var countparticipants = a.sql("select count(CAMPAIGNPARTICIPANTID) from CAMPAIGNPARTICIPANT "
        + " where CAMPAIGN_ID = '" + campaignid + "'");
    if (countparticipants > 0)
    {
        for (i=0; i<table.length; i++)
        {
            fixkost = eMath.addDec(fixkost, table[i][0])
        }
        for (i=0; i<costlist.length; i++)
        {
            varkost = eMath.addDec(varkost, costlist[i][1] * costlist[i][2])
        }
        list.push([ a.translate("fixe Kosten"), fixkost]);
        list.push([ a.translate("variable Kosten"), varkost]);
        list.push([ "", ""]);
        list.push([a.translate("Gesamtkosten"), eMath.addDec(fixkost, varkost)]);
        list.push([a.translate("Kosten pro Teilnehmer"), eMath.addDec(fixkost, varkost)/countparticipants]);
    }
}
a.ro(list);