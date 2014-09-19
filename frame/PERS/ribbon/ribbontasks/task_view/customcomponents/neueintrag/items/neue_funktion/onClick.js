var prompts = new Array();
prompts["PERSID"] =  a.valueof("$comp.persid");
prompts["LASTNAME"] =  a.valueof("$comp.lastname");
prompts["FIRSTNAME"] =  a.valueof("$comp.firstname");
prompts["SALUTATION"] =  a.valueof("$comp.salutation");
prompts["TITLE"] =  a.valueof("$comp.title");
prompts["comp4refresh"] = "$comp.tbl_ADDRESS";
prompts["autoclose"] =  false;

a.openLinkedFrame("PERS", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);