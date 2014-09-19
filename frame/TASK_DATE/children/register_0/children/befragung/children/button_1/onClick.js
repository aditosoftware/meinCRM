var cpid  = a.decodeFirst(a.valueof("$comp.tbl_participants")); //Markierter Teilnehmer
var relid = a.sql("select RELATION_ID from CAMPAIGNPARTICIPANT where CAMPAIGNPARTICIPANTID = '" + cpid + "'");

var quest = a.sql("select QUESTIONNAIRE_ID from CAMPAIGNSTEP where CAMPAIGNSTEPID = '" 
    + a.valueof("$comp.cbx_campaign_interview") + "'");
var datum = a.valueof("$sys.date");
var user = a.valueof("$sys.user");

// QUESTIONNAIRELOG anlegen - Kopfdaten
var col = ["QUESTIONNAIRELOGID", "QUESTIONNAIRE_ID", "RELATION_ID", "DATE_NEW", "USER_NEW"];
var typ = a.getColumnTypes("QUESTIONNAIRELOG", col);
var newid = a.getNewUUID();
a.sqlInsert("QUESTIONNAIRELOG", col, typ, [newid, quest, relid, datum, user])

// QUESTIONLOG anlegen - Vorbelegung der Antwortdaten mit LEER
var qid = a.sql("select QUESTIONID from QUESTION where QUESTIONNAIRE_ID = '" + quest + "'", a.SQL_COLUMN);
col = ["QUESTIONLOGID", "QUESTIONNAIRELOG_ID", "QUESTIONNAIRE_ID", "QUESTION_ID", "DATE_NEW", "USER_NEW"];
typ = a.getColumnTypes("QUESTIONLOG", col);
for (i=0;i<qid.length;i++)
{
    a.sqlInsert("QUESTIONLOG",col, typ, [a.getNewUUID(), newid, quest, qid[i], datum, user])
}

var prompts = new Array();
prompts["campaignparticipant"] = a.decodeFirst(a.valueof("$comp.tbl_participants")); //Markierter Teilnehmer

a.openFrame("QUESTIONNAIRELOG", " QUESTIONNAIRELOGID = '" + newid + "'", false, a.FRAMEMODE_SHOW, [], false, prompts )