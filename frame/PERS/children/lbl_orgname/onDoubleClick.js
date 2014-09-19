if( a.valueof("$comp.AOTYPE") != "2" )
{
    var condition = "ORGID = '" + a.valueof("$comp.lup_orgid") + "'";
    var prompts = new Array();
    prompts["ID"] =  a.valueof("$comp.persid");
    prompts["comp4refresh"] = ["$comp.lbl_OrgName", "$comp.lbl_PersAdress"];
    prompts["autoclose"] =  true;
	

    if ( a.valueof("$global.upwardLink") == "link")
    {
        a.openLinkedFrame("ORG", condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
    }
    else
    {
        a.openFrame("ORG", condition, false, a.FRAMEMODE_SHOW, null, true);  
    }
}