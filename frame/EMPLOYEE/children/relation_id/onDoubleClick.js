var condition = "RELATIONID = '" + a.valueof("$comp.relation_id") + "'";
var prompts = new Array();
prompts["ID"] =  a.valueof("$comp.relation_id");
prompts["comp4refresh"] = ["$comp.relation_id","$comp.Memo_Info"];
prompts["autoclose"] =  true;

if ( a.valueof("$global.upwardLink") == "link")
    a.openLinkedFrame("PERS", condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
else
    a.openFrame("PERS", condition, false, a.FRAMEMODE_SHOW, null, true);