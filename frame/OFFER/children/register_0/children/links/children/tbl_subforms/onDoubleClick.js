var id = a.decodeFirst(a.valueof("$comp.tbl_subforms"));
if ( id != '' )
{
    var prompts = new Array();
	
    prompts["ID"] = a.valueof("$comp.idcolumn");
    prompts["comp4refresh"] = "$comp.tbl_subforms";
    prompts["autoclose"] = false;

    var row = a.getTableData("$comp.tbl_subforms", id);
    // first column contains ID, table
    a.openLinkedFrame(a.decodeMS(row[0])[1], a.decodeMS(row[0])[1] + "ID = '" + a.decodeMS(row[0])[0] + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);	
}