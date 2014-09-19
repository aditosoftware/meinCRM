import("lib_campaign");
import("lib_history");

var relid = a.valueof("$comp.relationid");
var mid = a.decodeMS(a.decodeFirst(a.valueof("$comp.Tabelle_modul")))[0];

if (relid != "" && mid != "")
{
	var stepid = selectCampaignStep(mid);
	if (stepid != null)
	{
		setCampaignStep(mid, stepid, [relid]);
		// HISTORY- und HISTORYLINK-Eintrag erzeugen
	  var stufe = a.translate(a.sql("select step from campaignstep where campaignstepid = '" + stepid + "'"));
   	var name = a.sql("select name from campaign where campaignid = '" + mid + "'");
   	InsertHistory( [relid], "Intern", "o", "Kampagne", a.translate("Stufe '%0' in Kampagne '%1' gesetzt.", [stufe, name ]), [[mid, "6"]] );
		a.refresh("$comp.Table_history");
		a.refresh("$comp.Tabelle_modul");
	}
}