import("lib_distlist");

var relationid = a.valueof("$comp.relationid");

var distlistid = chooseDistlist();
if ( a.sql("select count(*) from DISTLISTMEMBER where RELATION_ID = '" + relationid + "' and DISTLIST_ID = '" + distlistid + "'") == 0 )
{
	addMembers( [relationid], distlistid );
	a.refresh("$comp.Tabelle_modul");
}