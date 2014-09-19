var id = a.decodeFirst(a.valueof("$comp.tblMilestone"))
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "$comp.tblMilestone";
prompts["autoclose"] =  true;

a.openLinkedFrame("HISTORY", "HISTORYID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);