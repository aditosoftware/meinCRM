var id = a.decodeFirst(a.valueof("$comp.Tabelle_modul"));
if ( id != '' )
{
    var prompts = new Array();
	
    prompts["ID"] = a.valueof("$comp.idcolumn");
    prompts["comp4refresh"] = "$comp.Tabelle_modul";
    prompts["autoclose"] = false;

    var row = a.getTableData("$comp.Tabelle_modul", id);
    // first column contains ID, table, tablekey evaluated from lib_frame and lib_modul
    a.openLinkedFrame(a.decodeMS(row[0])[2], a.decodeMS(row[0])[1] + " = '" + a.decodeMS(row[0])[0] + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);	
}