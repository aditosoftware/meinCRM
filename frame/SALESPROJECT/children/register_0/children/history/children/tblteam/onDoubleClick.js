if (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW)
{
	var id = a.sql("select RELATION_ID from SPMEMBER where SPMEMBERID = '" + a.decodeFirst(a.valueof("$comp.tblTeam")) + "'");
	var prompts = new Array();
	prompts["ID"] =  id;
	prompts["comp4refresh"] = "$comp.tblTeam";
	prompts["autoclose"] =  true;

	a.openLinkedFrame("PERS", "RELATION.RELATIONID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
}