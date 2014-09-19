import("lib_util")

var campaignid = a.valueof("$comp.campaignid");
if (campaignid != "") 
{
    var total = a.sql("select count(campaignparticipantid) from campaignparticipant where campaign_id = '" + campaignid + "'");
    var table = a.sql("select colour_foreground, code, count(campaignlog.step_id) from campaignlog "
        + " join campaignstep on step_id = campaignstepid where campaignlog.campaign_id = '" + campaignid 
        + "' group by campaignstepid, colour_foreground, code order by code", a.SQL_COMPLETE);
    var value = new Array();
    var names = new Array();	
    var color = new Array();	
    for (i=0; i<table.length; i++)
    {
        color[i] = table[i][0];
        names[i] = table[i][1];
        value[i] = table[i][2]/total * 100;
        if (value[i] == '') value[i] = 0;
    }
    a.ro([value, names, color]);
}