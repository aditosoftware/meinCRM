import("lib_distlist");

var relid = a.valueof("$comp.lup_relation");
var distid = a.valueof("$comp.distlistid");
var isparticipant = a.sql("select count(*) from DISTLISTMEMBER where RELATION_ID = '" 
    + relid + "' and DISTLIST_ID = '" + distid + "'");

if (isparticipant == 0 && addMembers( [relid], distid ) > 0)
{
    a.setValue("$comp.lup_relation", "");
    a.refresh("$comp.tbl_distlistmember");
    a.refresh("$comp.label_anz_member");
}
else a.showMessage(a.translate("ist bereits als Teilnehmer eingetragen !"))