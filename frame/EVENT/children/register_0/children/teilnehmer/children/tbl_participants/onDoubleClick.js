var id = a.sql("select relation_id from EVENTPARTICIPANT where EVENTPARTICIPANTID = '" + a.decodeFirst(a.valueof("$comp.tbl_participants")) + "'");
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "$comp.tbl_participants";
prompts["autoclose"] =  true;

a.openLinkedFrame("PERS", "relation.relationid = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);