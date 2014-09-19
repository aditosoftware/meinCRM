var id = a.valueof("$comp.MACHINE_ID")
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "";
prompts["autoclose"] =  true;

a.openLinkedFrame("MACHINE", "MACHINE.MACHINEID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);