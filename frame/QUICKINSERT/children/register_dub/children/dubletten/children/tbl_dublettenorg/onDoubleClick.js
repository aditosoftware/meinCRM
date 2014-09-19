var pid = a.decodeFirst(a.valueof("$comp.tbl_dublettenORG"));

var prompts = new Array();
prompts["ID"] = pid;
prompts["autoclose"] =  true;

var condition = "RELATION.RELATIONID = '" + pid + "'";

if ( a.valueof("$global.upwardLink") == "link")
    a.openLinkedFrame("ORG", condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
else
    a.openFrame("ORG", condition, false, a.FRAMEMODE_SHOW, null, true);