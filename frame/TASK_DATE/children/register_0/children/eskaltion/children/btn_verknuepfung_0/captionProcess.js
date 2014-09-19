import("lib_frame");

var id =  a.decodeFirst(a.valueof("$comp.tbl_AufgabeEskalation"));
if (id != "")
{
    var links = a.sql("SELECT FRAME, DBIDCOLUMN, DBID FROM ASYS_CALENDARLINK WHERE ENTRYID = '" + id + "'", a.SQL_COMPLETE);
    for (var i = 0; i < links.length; i++)
    {
        var frame = links[0][0];
        frame = frame.substr( 5, frame.length );
		
        var fd = new FrameData();
        var res = fd.getData("name", frame, ["title"]);
        if(res != "")
            a.rs(a.translate(res));
        else
            a.rs(a.translate("Verknüpfung"));
    }
}