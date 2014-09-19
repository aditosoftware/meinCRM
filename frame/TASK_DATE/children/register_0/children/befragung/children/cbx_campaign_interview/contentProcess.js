import("lib_sql");
import("lib_keyword");

/*Es werden nur Kampagnen + Stufe angezeigt wenn ein Fragenbogen hinterlegt ist und 
die Stufe den Status "läuft" hat.
*/
 
var ma_relationid = a.valueof("$global.user_relationid");
var list = a.sql(" select campaignstep.campaignstepid, campaign.name, questionnaire.title, campaignstep.step "
    + " from campaignstep left outer join questionnaire on (campaignstep.questionnaire_id = questionnaire.questionnaireid)"
    + " left outer join campaign on (campaign.campaignid = campaignstep.campaign_id)"
    + " where campaignstep.questionnaire_id is not null and campaignstep.state = 2" //status läuft = 2
    + " order by campaign.name", a.SQL_COMPLETE);
var retlist = new Array();
for ( i = 0; i < list.length; i++ ) retlist.push( new Array( list[i][0], list[i][1] + " - " +  list[i][3] + " / " +  list[i][2] ) );

a.returnobject(retlist);