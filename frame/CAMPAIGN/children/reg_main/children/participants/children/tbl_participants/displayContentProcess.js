import("lib_sql");
import("lib_campaign");

var list = a.createEmptyTable(4);

var campaignid = a.valueof("$comp.campaignid");
if (campaignid != "")
{
    var ref = a.valueof("$comp.Liste_step_included") + a.valueof("$comp.chk_laststep") + a.valueof("$comp.employee") + a.valueof("$comp.channel");

    var sql = "select campaignparticipantid, campaignstep.colour_foreground, campaignstep.colour_background, "
    + " case when (select count(*) from COMMRESTRICTION where RELATION_ID = RELATION.RELATIONID) > 0 or "
    + " (select count(*) from COMMRESTRICTION join RELATION R on RELATION_ID = R.RELATIONID where R.ORG_ID = ORG.ORGID  and R.PERS_ID is null) > 0 then 1 else 0 end, "
    + concat( [ concat(["SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME"]) , "ORGNAME"], " - " )
    + ", campaignstep.step,"
    + " (select " + concat(new Array("lastname", "firstname")) 
    + " from relation join pers on (relation.pers_id = pers.persid) "
    + " where relationid = campaignparticipant.employee_relation_id), favoritechannel " 
    + " from campaignparticipant"	
    + " join relation on (relation.relationid = campaignparticipant.relation_id)"
    + " join org on (relation.org_id = org.orgid)"
    + " left join pers on (relation.pers_id = pers.persid)"
    + " left join campaignstep on (campaignstep.campaignstepid = campaignparticipant.campaignstep_id)"
    + " where campaignparticipant.campaign_id = '" + campaignid + "'";

    list = a.sql(sql + computeCondition() +  "  order by 4", a.SQL_COMPLETE);
    for(i = 0; i < list.length; i++) list[i][4] = a.translate(list[i][4]);
}
a.ro(list);