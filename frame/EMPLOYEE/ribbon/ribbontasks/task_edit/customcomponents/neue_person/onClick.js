var prompts = new Array();
prompts["ID"] =  a.sql("select ORG_ID from RELATION where RELATIONID = '" + a.valueof("$global.user_relationid") + "'"); 
//prompts["setValues"] = [["$comp.relation_id", "$comp.relationid", true]];
prompts["autoclose"] =  true;

a.openLinkedFrame("PERS", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);