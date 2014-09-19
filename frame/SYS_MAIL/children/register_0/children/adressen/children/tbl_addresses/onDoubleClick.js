var relationid = a.valueof("$comp.decoded_adress");

if ( relationid != "")
{
    var prompts = new Array();
    prompts["ID"] = relationid;
    prompts["comp4refresh"] = "$comp.tbl_addresses";
    prompts["autoclose"] =  true;

    var frame = a.sql("select PERS_ID from RELATION where RELATIONID = '" + "'") == "" ? "ORG" : "PERS"; 
    var condition = "RELATIONID = '" + prompts["ID"] + "'";
    var link = "$comp.decoded_adress|RELATION.RELATIONID";
    if ( a.valueof("$global.downwardLink") == "multiple" )
    {
        link = "";
        condition = "RELATION.RELATIONID = '" + relationid + "'"; 
    }
    a.openLinkedFrame(frame, condition, false, a.FRAMEMODE_SHOW, link, null, false, prompts);
}