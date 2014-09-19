var campaignid = a.valueof("$comp.campaignid");
if (campaignid != '')
    a.rq("select count(*) from campaignparticipant where campaign_id = '" + campaignid + "'");