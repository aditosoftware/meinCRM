import("lib_campaign");
var mid = a.decodeMS(a.decodeFirst(a.valueof("$comp.Tabelle_modul")))[0];
var relationid = a.valueof("$comp.relationid");

if ( deleteParticipantsWithCondition( "ORG", "RELATIONID = '" + relationid + "'", mid ) > 0 )
{
	a.refresh("$comp.Tabelle_modul");
}