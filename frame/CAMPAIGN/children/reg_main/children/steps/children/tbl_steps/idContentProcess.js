var campaignid = a.valueof("$comp.campaignid");
var list = "";
if (campaignid != "") 
{

    list = a.sql("select CAMPAIGNSTEPID, '', CODE, STEP,"
        + " DATE_START, DATE_END, STATE, MEDIUM, COST, QUESTIONNAIRE_ID, COLOUR_FOREGROUND "
        + " from CAMPAIGNSTEP "
        + " where CAMPAIGN_ID = '" + campaignid + "'" 
        + " order by CODE", a.SQL_COMPLETE);
}
if ( list.length == 0 ) list = a.createEmptyTable(11);
a.ro(list);