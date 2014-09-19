var id = a.decodeFirst(a.valueof("$comp.tbl_AufgabeEskalation"));
if (id != "")
{
    var links = a.sql("SELECT FRAME, DBIDCOLUMN, DBID FROM ASYS_CALENDARLINK WHERE ENTRYID = '" + id + "'", a.SQL_COMPLETE);
    for (var i = 0; i < links.length; i++)
    {
        var frame = links[i][0];
        frame = frame.substr( 5, frame.length );
   
        var condition = links[i][1] + " = '" + links[i][2] + "'";
        var prompts = new Array();
        prompts["ID"] =  links[i][2];
        prompts["autoclose"] =  true;
	
        if ( a.valueof("$global.upwardLink") == "link")
        {
            a.openLinkedFrame(frame, condition, false, a.FRAMEMODE_SHOW, "", null, false, prompts);
        }
        else
        {
            a.openFrame(frame, condition, false, a.FRAMEMODE_SHOW, null, true);  
        }   
    }
}