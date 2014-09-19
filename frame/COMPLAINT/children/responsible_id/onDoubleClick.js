var id = a.valueof("$comp.RESPONSIBLE_ID");
var prompts = new Array();
prompts["ID"] = id
prompts["comp4refresh"] = "";
prompts["autoclose"] =  true;

a.openLinkedFrame("PERS", "RELATION.RELATIONID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);