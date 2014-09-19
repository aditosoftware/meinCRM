var id = a.decodeFirst(a.valueof("$comp.Tabelle_Salesproject"))
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "$comp.Tabelle_Salesproject";
prompts["autoclose"] = false;

a.openLinkedFrame("SALESPROJECT", "SALESPROJECT.SALESPROJECTID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);