import("lib_campaign");
import("lib_distlist");
import("lib_event");

var relations = getRelationIDs();
if (relations != "")
{
    addParticipantsWithConditionEvent( "CAMPAIGN", "CAMPAIGN_ID = '" + a.valueof("$comp.idcolumn") 
        + "' and RELATIONID IN ('" + relations.join("','") + "')");
}