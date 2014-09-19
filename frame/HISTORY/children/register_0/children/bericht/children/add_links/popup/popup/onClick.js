var id = a.decodeMS( a.decodeFirst(a.valueof("$comp.add_links")) );

if ( id.length == 3 )
{
    var prompts = new Array();
    prompts["autoclose"] = true;

    a.openLinkedFrame( id[2], id[1] + " = '" + id[0] + "'", false, a.FRAMEMODE_SHOW, "", null, false, prompts);
}