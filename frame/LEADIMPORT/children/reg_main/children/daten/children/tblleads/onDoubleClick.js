var pid = a.decodeFirst(a.valueof("$comp.tblLeads"));

var condition = a.sql("select DUPLICAT, ORG_ID, PERS_ID  from LEAD where LEADID = '" + pid + "'", a.SQL_ROW);
var prompts = new Array();
var id = a.valueof("$comp.edtLEAD_DEC");
prompts["ID"] = pid;
prompts["comp4refresh"] = "$comp.tblLeads";
prompts["autoclose"] =  true;

if ( condition[0] == 1 )
{
    a.globalvar("$global.importdefid", a.valueof("$comp.IMPORTDEVID"));
		
    if ( a.valueof("$global.upwardLink") == "link")
    {
        a.openLinkedFrame("LEAD", "LEADID = '" + id + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
    }
    else
    {
        a.openFrame("LEAD", "LEADID = '" + id + "'", false, a.FRAMEMODE_SHOW, null, true); 
    }
}

else
{
    if ( condition[2] != "")
		
        if ( a.valueof("$global.upwardLink") == "link")
        {
            a.openLinkedFrame( "PERS", "PERS.PERSID = '" +  condition[2] + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
        }
        else
        {
            a.openFrame("PERS", "PERS.PERSID = '" +  condition[2] + "'", false, a.FRAMEMODE_SHOW, null, true);
        }
		
    else
		
    if ( a.valueof("$global.upwardLink") == "link")
    {
        a.openLinkedFrame("ORG", "ORG.ORGID = '" +  condition[1] + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
    }
    else
    {
        a.openFrame("ORG", "ORG.ORGID = '" +  condition[1] + "'", false, a.FRAMEMODE_SHOW, null, true); //checked by FP
    }				
}