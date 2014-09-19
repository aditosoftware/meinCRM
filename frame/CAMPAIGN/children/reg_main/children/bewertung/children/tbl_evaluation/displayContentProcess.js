import("lib_util")

var campaignid = a.valueof("$comp.campaignid");
var table = a.createEmptyTable(5);
if (campaignid != "") 
{
    table = a.sql("select colour_foreground, code, step, COST, count(campaignlog.step_id), COST * count(campaignlog.step_id) from campaignlog "
        + " join campaignstep on step_id = campaignstepid where campaignlog.campaign_id = '" + campaignid 
        + "' group by campaignstepid, colour_foreground, code, step, COST order by code", a.SQL_COMPLETE);
    a.imagevar("$image.evaluation", table);
}
a.ro(table);