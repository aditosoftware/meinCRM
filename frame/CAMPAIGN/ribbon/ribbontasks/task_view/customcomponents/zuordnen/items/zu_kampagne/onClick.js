import("lib_campaign");
//import("lib_distlist");

var relations = getRelationIDs();
if (relations != "")
{
    //	addMembersWithCondition( "", "RELATIONID IN ('" + relations.join("','") + "')");
    addParticipantsWithCondition( "CAMPAIGN", "RELATIONID IN ('" + relations.join("','") + "')");
}