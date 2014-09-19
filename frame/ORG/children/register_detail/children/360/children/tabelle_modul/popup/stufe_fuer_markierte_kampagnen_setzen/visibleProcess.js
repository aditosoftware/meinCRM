import("lib_grant");
import("lib_frame");

var mid = a.decodeFirst( a.valueof("$comp.Tabelle_modul"));

if (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW && mid != "")
{
	var row = a.getTableData("$comp.Tabelle_modul", mid);
	var fd = new FrameData();
	var id = fd.getData("name", "CAMPAIGN", ["id"]);

	a.rs(isgranted("insert", id, a.valueof("$comp.idcolumn"), mid) && row[1] == 'CAMPAIGN' && row[4] == a.translate("enthalten"));
}
else
{
	a.rs(false);
}