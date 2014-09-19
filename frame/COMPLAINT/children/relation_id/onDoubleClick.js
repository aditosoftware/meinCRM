import("lib_relation");

var id = a.valueof("$comp.RELATION_ID")
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "";
prompts["autoclose"] =  true;

switch(getRelationType(id))
{
    case 1 :
        a.openLinkedFrame("ORG", "RELATION.RELATIONID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
        break;
    case 2 :
    case 3 :
        a.openLinkedFrame("PERS", "RELATION.RELATIONID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
        break;
}