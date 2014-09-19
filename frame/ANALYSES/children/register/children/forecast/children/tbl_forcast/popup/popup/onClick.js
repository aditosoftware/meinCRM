var id = a.decodeMS( a.decodeFirst(a.valueof("$comp.tbl_forcast")) );

if ( id.length == 4 )
{
    var prompts = new Array();
    prompts["ID"] =  id;
    prompts["autoclose"] = false;

    a.openLinkedFrame("SALESPROJECT", "SALESPROJECTID = '" + id[3] + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
}