var pid = a.valueof("$comp.attr_id");

var prompts = new Array();
prompts["ID"] =  a.valueof("$comp.attrid");
prompts["comp4refresh"] = "$comp.lbl_FirstAttr";
prompts["autoclose"] =  true;

a.openLinkedFrame("ATTRIBUTES", "ATTRID = '" + pid + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);