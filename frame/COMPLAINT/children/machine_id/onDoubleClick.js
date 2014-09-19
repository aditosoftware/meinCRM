var id = a.valueof("$comp.MACHINE_ID");

var prompts = new Array();
prompts["ID"] = "";
prompts["comp4refresh"] = "$comp.MACHINE_ID";
prompts["autoclose"] =  true;

a.openLinkedFrame("MACHINE", "MACHINEID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);