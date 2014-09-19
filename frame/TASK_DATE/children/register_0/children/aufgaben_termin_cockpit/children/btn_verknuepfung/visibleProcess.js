var linkscount = 0;
var id =  a.decodeFirst(a.valueof("$comp.tbl_Aufgabe"));
if (id != "")
{    
    linkscount = a.sql("SELECT count(*) FROM ASYS_CALENDARLINK WHERE ENTRYID = '" + id + "'");
    var entry = calendar.getEntry(id)[0];

    if ( !(entry[calendar.USER2]["cn"] != a.valueof("$sys.user") && entry[calendar.CLASSIFICATION] == "PRIVATE"))
        a.imagevar("$image.editableToDo", true);
    else 
        a.imagevar("$image.editableToDo", false);
}
a.rs( linkscount > 0 )