var pid = a.decodeFirst(a.valueof("$comp.Table_history"))
var persid = a.valueof("$comp.persid");

var prompts = new Array();
prompts["ID"] =  a.valueof("$comp.persid");
prompts["comp4refresh"] = "$comp.Table_history";
prompts["autoclose"] =  true;

var condition = "HISTORY.HISTORYID in (select HISTORY_ID from HISTORYLINK where ROW_ID in (select RELATIONID from RELATION where PERS_ID = '" + persid + "') )";
var link = "$comp.Label_history_dec|HISTORY.HISTORYID";

if ( a.valueof("$global.downwardLink") == "multiple" )
{
    link = "";
    condition = "HISTORYID = '" + pid + "'";
}

a.openLinkedFrame("HISTORY", condition, false, a.FRAMEMODE_SHOW, link, null, false, prompts);