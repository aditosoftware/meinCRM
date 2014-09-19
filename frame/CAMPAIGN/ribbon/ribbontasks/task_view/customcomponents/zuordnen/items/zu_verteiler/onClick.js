import("lib_campaign");
import("lib_distlist");

var relations = getRelationIDs();
if (relations != "")
{
    addMembersWithCondition( "", "RELATIONID IN ('" + relations.join("','") + "')");
    a.refresh("$comp.tbl_distlist");
}