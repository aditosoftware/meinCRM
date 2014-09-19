var pid = a.decodeFirst(a.valueof("$comp.tbl_orgdubletten"));

var frame = "ORG";
var condition = "RELATION.RELATIONID = '" + pid + "'"
var prompts = new Array();
prompts["ID"] = pid;
prompts["comp4refresh"] = "$comp.tbl_orgdubletten";
prompts["autoclose"] =  true;

if ( a.valueof("$global.upwardLink") == "link")
{
    a.openLinkedFrame(frame, condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
}
else
{
    a.openFrame(frame, condition, false, a.FRAMEMODE_SHOW, null, true); //checked by FP
}