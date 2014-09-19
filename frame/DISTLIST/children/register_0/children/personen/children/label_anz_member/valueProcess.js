var participants = a.decodeMS(a.valueof("$comp.tbl_distlistmember"));
var distlistid = a.valueof("$comp.distlistid");
if (distlistid != '' && participants != '')
{
    var total = a.sql("select count(distlistmemberid) from distlistmember where distlist_id = '" + distlistid + "'");
    a.rs(a.translate("%0" + " " + "Teilnehmer von" + " " + "%1" + " " + "markiert", [participants.length, total]));
}