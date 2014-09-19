import("lib_relation")

var id = a.valueof("$comp.RELATION_ID")
var prompts = new Array();
prompts["ID"] =  id;
prompts["comp4refresh"] = "";
prompts["autoclose"] =  true;

switch(getRelationType(id))
{
    case 1 :
        var orgid = a.sql("select ORG_ID from RELATION where RELATIONID = '" + id + "'")
        a.openLinkedFrame("ORG", "ORG.ORGID = '" + orgid + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
        break;
    case 2 :
    case 3 :
        var persid = a.sql("select PERS_ID from RELATION where RELATIONID = '" + id + "'")
        a.openLinkedFrame("PERS", "PERS.PERSID = '" + persid + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
        break;
}