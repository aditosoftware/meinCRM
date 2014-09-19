var id = a.decodeFirst(a.valueof("$comp.Table_Items"))
if ( id != "" )
{
	var wmode =  a.valueof("$sys.workingmode");
	var prompts = new Array();

	prompts["offercode"] = a.valueof("$comp.OFFERCODE");
	prompts["language"] = a.valueof("$comp.LANGUAGE");
	prompts["currency"] = a.valueof("$comp.CURRENCY");
	prompts["relorgid"] = a.valueof("$comp.relorgid");
	prompts["comp4refresh"] =  ["$comp.Table_Items", "$comp.NET"];
	prompts["autoclose"] =  true;
	prompts["ID"] = a.valueof("$comp.OFFERID");
	prompts["isedit"] = true;

	a.openLinkedFrame("OFFERITEM", "OFFERITEMID = '" + id + "'", false, a.FRAMEMODE_EDIT, "", null, false, prompts);
}