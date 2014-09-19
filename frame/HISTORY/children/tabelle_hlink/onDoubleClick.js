import("lib_frame");

if (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW)
{
    var hlinkid = a.decodeFirst(a.valueof("$comp.Tabelle_hlink"));

    if (hlinkid != "")
    {
        var hlink = a.sql("select OBJECT_ID, ROW_ID from HISTORYLINK where HISTORYLINKID = '" + hlinkid + "'", a.SQL_ROW );
		
        if ( hlink[0] == "3" ) hlink[0] = "2" // Wenn Funktion dann Frame PERS
        var fd = new FrameData();
        var frame = fd.getData("id", hlink[0], ["name"]);
        var condition = fd.getData("id", hlink[0], ["idcolumn"]) + " = '" + hlink[1] + "'";

        var prompts = new Array();
        prompts["ID"] =  hlink[1];
        prompts["autoclose"] =  true;	
		
        if ( a.valueof("$global.upwardLink") == "link")
            a.openLinkedFrame(frame, condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
        else
            a.openFrame(frame, condition, false, a.FRAMEMODE_SHOW, null, true);  		
    }
}