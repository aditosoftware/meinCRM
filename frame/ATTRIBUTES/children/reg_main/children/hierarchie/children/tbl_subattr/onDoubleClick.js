var pid = a.decodeFirst(a.valueof("$comp.tbl_subAttr"));

var attrcomponent = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + pid + "'");
if ( attrcomponent != "")
{
    var prompts = new Array();
    prompts["ID"] = pid;
    prompts["comp4refresh"] = "$comp.tbl_subAttr";
    prompts["autoclose"] =  true;

    var condition =  "ATTR.ATTRID = '" + prompts["ID"] + "'";
    var link = "$comp.attr_decoded|ATTR.ATTRID";
    link="";
    if ( a.valueof("$global.downwardLink") == "multiple" ) 
    {
        link = "";
    }
    a.openLinkedFrame("ATTRIBUTES", condition, false, a.FRAMEMODE_SHOW, link, null, false, prompts);
}