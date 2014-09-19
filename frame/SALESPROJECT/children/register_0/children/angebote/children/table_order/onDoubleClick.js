var id = a.decodeFirst(a.valueof("$comp.Table_order"))
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "$comp.Table_order";
prompts["autoclose"] =  true;

a.openLinkedFrame("SALESORDER", "SALESORDERID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);