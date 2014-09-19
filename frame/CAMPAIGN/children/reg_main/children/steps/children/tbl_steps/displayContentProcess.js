import("lib_keyword");
import("lib_sql");

var campaignid = a.valueof("$comp.campaignid");
var list = "";
if (campaignid != "") 
{
    list = a.sql("select campaignstep.campaignstepid, campaignstep.colour_foreground, campaignstep.code,"
        + " campaignstep.step,"
        + " campaignstep.date_start, campaignstep.date_end, "
        + "(select keyname1 from keyword where" + getKeyTypeSQL("KampStufStat") +" and keyvalue = campaignstep.state),"
        + "(select keyname1 from keyword where" + getKeyTypeSQL("OrgMedium") + " and keyvalue = campaignstep.medium),"
        + " COST, questionnaire.title, campaignstep.colour_foreground"
        + " from campaignstep left outer join questionnaire on (campaignstep.questionnaire_id = questionnaire.questionnaireid)"
        + " where campaignstep.campaign_id = '" + campaignid + "'" 
        + " order by campaignstep.code", a.SQL_COMPLETE);
		
    for(i = 0; i < list.length; i++)
    {
        list[i][4] = a.translate(list[i][4]);
        list[i][7] = a.translate(list[i][7]);
        list[i][8] = a.translate(list[i][8]);
    }
}
if ( list.length == 0 ) list = a.createEmptyTable(11);
a.ro(list);