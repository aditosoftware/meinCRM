var campaignid = a.valueof("$comp.campaignid");
if (campaignid != '')
{
    var list = a.sql("select campaignstepid, step from campaignstep where campaign_id = '" 
        + campaignid + "' order by campaignstep.code", a.SQL_COMPLETE);
				
    for(i = 0; i < list.length; i++)
    {
        list[i][1] = a.translate(list[i][1]);
    }
    a.ro(list);
}