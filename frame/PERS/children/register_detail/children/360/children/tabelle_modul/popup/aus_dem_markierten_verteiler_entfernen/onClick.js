import("lib_distlist");

var relationid = a.valueof("$comp.relationid");
var mid = a.decodeMS(a.decodeFirst(a.valueof("$comp.Tabelle_modul")))[0];

if ( deleteMembersWithCondition( "PERS", "RELATIONID = '" + relationid + "'", mid ) > 0 )
{
	a.refresh("$comp.Tabelle_modul");
}