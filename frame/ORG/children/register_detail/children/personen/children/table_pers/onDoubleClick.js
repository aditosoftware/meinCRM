var pid = a.decodeFirst(a.valueof("$comp.Table_pers"))

var prompts = new Array();
prompts["ID"] =  a.valueof("$comp.orgid");
prompts["comp4refresh"] = "$comp.Table_pers";
prompts["autoclose"] =  true;

var condition = "RELATION.ORG_ID = '" + prompts["ID"] + "'";
var link = "$comp.Label_relpers_dec|RELATION.RELATIONID";
if ( a.valueof("$global.downwardLink") == "multiple" )
{
    link = "";
    condition = "RELATION.RELATIONID = '" + a.valueof("$comp.Label_relpers_dec") + "'"; 
}
a.openLinkedFrame("PERS", condition, false, a.FRAMEMODE_SHOW, link, null, false, prompts);