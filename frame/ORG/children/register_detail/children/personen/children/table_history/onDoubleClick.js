var relationid = a.valueof("$comp.relationid");
var histid = a.valueof("$comp.Label_history_dec");

var prompts = new Array();
prompts["ID"] = histid;
prompts["comp4refresh"] = "$comp.Table_history";
prompts["autoclose"] =  true;

var hasOrgID = a.sql("select ROW_ID from HISTORYLINK where HISTORY_ID = '" + histid + "' and OBJECT_ID = 1 and ROW_ID = '" + relationid + "'");
if (hasOrgID == "")
    var condition = "HISTORYID in (select HISTORY_ID from HISTORYLINK where OBJECT_ID = 3 and ROW_ID ='" + a.decodeFirst(a.valueof("$comp.Table_pers")) + "')";
else
    condition = "HISTORYID in (select HISTORY_ID from HISTORYLINK where OBJECT_ID = 1 and ROW_ID ='" + relationid + "')";

var link = "$comp.Label_history_dec|HISTORY.HISTORYID";
if ( a.valueof("$global.downwardLink") == "multiple" ) 
{
    link = "";
    condition = "HISTORYID = '" + histid + "'";
}

a.openLinkedFrame("HISTORY", condition, false, a.FRAMEMODE_SHOW, link, null, false, prompts); //checked by BH-090311