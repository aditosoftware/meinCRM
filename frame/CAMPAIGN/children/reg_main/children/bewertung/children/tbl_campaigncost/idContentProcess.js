var campaignid = a.valueof("$comp.campaignid");
var table = a.createEmptyTable(4);
if (campaignid != "") 
{
    table = a.sql("select CAMPAIGNCOSTID, CATEGORY, NET from CAMPAIGNCOST "
        + " where CAMPAIGNCOST.CAMPAIGN_ID = '" + campaignid + "'", a.SQL_COMPLETE);
}
a.ro(table);