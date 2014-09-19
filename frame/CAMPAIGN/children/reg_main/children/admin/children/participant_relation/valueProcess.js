var part_dec = a.valueof("$comp.participants_decoded");
if (part_dec != "")
{
    a.rq("select relation_id from campaignparticipant where campaignparticipantid = '" + part_dec + "'");
}