var id = a.decodeFirst(a.valueof("$comp.Table_history"))
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "$comp.Table_history";
prompts["autoclose"] =  true;

a.openLinkedFrame("HISTORY", "HISTORYID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);