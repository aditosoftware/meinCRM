var tbl = a.decodeFirst(a.valueof("$comp.tblTablelist"))

var prompts = new Array();
prompts["comp4refresh"] = "$comp.tblTablelist";
prompts["autoclose"] =  false;

var link = "$comp.TABLEID_DECODED|AOSYS_TABLEREPOSITORY.TABLEID";
if ( a.valueof("$global.downwardLink") == "multiple" ) 
{
    link = "";
}
a.openLinkedFrame("TABLEADMIN", "TABLEID = '" + tbl + "'", false, a.FRAMEMODE_SHOW, link, null, false, prompts);