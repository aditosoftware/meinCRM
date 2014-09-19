var id = a.decodeFirst(a.valueof("$comp.tbl_serviceorder"))
if ( id != "" )
{
    var wmode =  a.valueof("$sys.workingmode");
    var prompts = new Array();

    prompts["$image.ID"] = a.valueof("$comp.idcolumn");
    prompts["comp4refresh"] =  ["$comp.tbl_serviceorder"];
    prompts["autoclose"] =  true;

    a.openLinkedFrame("SERVICEORDER", "SERVICEORDERID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
}