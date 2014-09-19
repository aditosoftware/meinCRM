var pid = a.decodeFirst(a.valueof("$comp.tbl_dubletten_pers"))

var prompts = new Array();
prompts["ID"] =  pid;
prompts["comp4refresh"] = "$comp.tbl_dubletten_pers";
prompts["autoclose"] =  true;

var condition = "RELATION.RELATIONID = '" + pid + "'";

if ( a.valueof("$global.upwardLink") == "link")
    a.openLinkedFrame("PERS", condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
else
    a.openFrame("PERS", condition, false, a.FRAMEMODE_SHOW, null, true); //ckecked by BH-090312