var pid = a.decodeFirst(a.valueof("$comp.tbl_dubletten"))

var prompts = new Array();
prompts["ID"] = pid;
prompts["comp4refresh"] = "$comp.tbl_dubletten";
prompts["autoclose"] =  true;

var condition = "RELATION.RELATIONID = '" + pid + "'"

if ( a.valueof("$global.upwardLink") == "link")
    a.openLinkedFrame("ORG", condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
else
    a.openFrame("ORG", condition, false, a.FRAMEMODE_SHOW, null, true);