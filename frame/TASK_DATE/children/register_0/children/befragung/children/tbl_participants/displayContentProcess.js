import("lib_sql");
import("lib_keyword");

/*
Es werden alle Teilnehmer angezeigt mit der Stufe = "läuft" und man selbst als Zuständiger eingetragen ist.
+ evtl. Einschränkung auf Filter (Kampagnenstufe)
*/

var campaignstepid = a.valueof("$comp.cbx_campaign_interview");
var clientlanguage = a.valueof("$sys.clientlanguage");
var ma_relationid = a.valueof("$global.user_relationid");

var whereteil = " where employee_relation_id = '" + ma_relationid + "'"//nur zuständige Kontaktpersonen 
+ " and campaignstep.state = 2" //status läuft = 2; 
+ " and campaignstep.questionnaire_id is not null" //nur Campagnenstufen bei denen ein Interview eingetragen ist

//Filter auf die Stufe
if (campaignstepid != "") 
{
    whereteil = whereteil + " and campaignparticipant.campaignstep_id = '" + campaignstepid + "'"; //bei selektion auf Stufe einschränken
}

var sql = " select campaignparticipantid, campaignstep.colour_foreground, campaignstep.colour_background, "
+ concat( [ concat(["SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME"]) , "ORGNAME"], " - " ) + ", "
+ " (select min(ADDR) from COMM where relation.relationid = comm.relation_id and COMMID in "
+ " ( select COMMID from COMM join KEYWORD on (KEYWORD.KEYVALUE = COMM.MEDIUM_ID) where"
+ getKeyTypeSQL("PersMedium")+" and keyname2 = 'fon')) , "
+ concat(new Array("campaign.name", "' - '", "campaignstep.step"))
+ " from campaignparticipant"	
+ " join campaignstep on (campaignstep.campaignstepid = campaignparticipant.campaignstep_id)"
+ " join relation on (relation.relationid = campaignparticipant.relation_id)"
+ " join org on (relation.org_id = org.orgid)"
+ " left join pers on (relation.pers_id = pers.persid)"
+ " join campaign on (campaign.campaignid = campaignstep.campaign_id)"
+ whereteil

a.rq(sql);