import("lib_history");
import("lib_keyword");

var orgrelid = a.valueof("$comp.relationid");
var relationid = a.decodeFirst(a.valueof("$comp.Table_pers"));
if ( relationid != "")	InsertHistory( [relationid] );
else
{
	var tab = [];
	var relobjSid = a.sql("select ORG_ID from OBJECTRELATION join RELATION on RELATIONID = DEST_ID where SOURCE_ID = '" + orgrelid + "' and RELVALUE = 9", a.SQL_COLUMN);
	var relobjDid = a.sql("select ORG_ID from OBJECTRELATION join RELATION on RELATIONID = SOURCE_ID where DEST_ID = '" + orgrelid + "' and RELVALUE = 9", a.SQL_COLUMN);
	for (i=0; i<relobjSid.length; i++) tab.push(relobjSid[i]);
	for (i=0; i<relobjDid.length; i++) tab.push(relobjDid[i]);
	relationid = a.sql("select RELATIONID from PERS join RELATION on PERSID = PERS_ID "
		+ " where RELATION.STATUS = 1 and ORG_ID in ('" + a.valueof("$comp.orgid") + "', '" + tab.join("','") + "')", a.SQL_COLUMN);
	a.localvar("$local.relids", "'" + relationid.join("','") + "'")
	relationid = a.askUserQuestion("Teilnehmer", "DLG_CHOOSE_PERS_FORHISTORY");
	if ( relationid != null ) //Abbruch geklickt
	{
		var relid = a.decodeMS(relationid["DLG_CHOOSE_PERS_FORHISTORY.tbl_pers"]);
		if (relid.length == 0)	relationid = [orgrelid]; // keine Person markiert und OK geklickt
		else	relationid = relid;
		InsertHistory( relationid );
	}
}