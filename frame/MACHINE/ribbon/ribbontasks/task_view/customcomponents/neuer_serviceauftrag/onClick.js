var prompts = new Array();

prompts["ID"] = a.valueof("$comp.idcolumn");
prompts["relationid"] = a.valueof("$comp.RELATION_ID");
prompts["comp4refresh"] =  ["$comp.Table_Items"];
prompts["autoclose"] =  true;

a.openLinkedFrame("SERVICEORDER", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);