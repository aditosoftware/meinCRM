var cpid  = a.decodeFirst(a.valueof("$comp.tbl_participants")); //Markierter Teilnehmer
var relid = a.sql("select RELATION_ID from CAMPAIGNPARTICIPANT where CAMPAIGNPARTICIPANTID = '" + cpid + "'");

var quest = a.sql("select QUESTIONNAIRE_ID from CAMPAIGNSTEP where CAMPAIGNSTEPID = '" 
    + a.valueof("$comp.cbx_campaign_interview") + "'");

var sql = "select count(*) from QUESTIONNAIRELOG where RELATION_ID = '" + relid + "'";
var color = -16738048; //grün

if (a.sql(sql) > 0)
{
    sql += " and QUESTIONNAIRE_ID = '" + quest + "'";
    if (a.sql(sql) > 0) color = -65536; // rot
    else color = -256; // gelb
}
a.rs(color);