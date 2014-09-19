var id = a.decodeFirst(a.valueof("$comp.Table_Items"))
if ( id != "" )
{
    var wmode =  a.valueof("$sys.workingmode");
    var prompts = new Array();

    prompts["offercode"] = a.valueof("$comp.OFFERCODE");
    prompts["language"] = a.valueof("$comp.LANGUAGE");
    prompts["currency"] = a.valueof("$comp.CURRENCY");
    prompts["comp4refresh"] =  ["$comp.Table_Items", "$comp.NET"];
    prompts["autoclose"] =  true;
    prompts["$image.ID"] = a.valueof("$comp.OFFERID");
    prompts["$image.isedit"] = ((wmode == a.FRAMEMODE_EDIT || wmode == a.FRAMEMODE_NEW) && a.valueof("$comp.cmb_Status") == "");

    a.openLinkedFrame("OFFERITEM", "OFFERITEMID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
}