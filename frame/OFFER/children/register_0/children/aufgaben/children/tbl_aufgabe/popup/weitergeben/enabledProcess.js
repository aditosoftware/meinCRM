var enabled = false;

var id =  a.decodeFirst(a.valueof("$comp.tbl_Aufgabe"));
if (id != "")
{    
    var entry = calendar.getEntry(id)[0];
    if ( !(entry[calendar.USER2]["cn"] != a.valueof("$sys.user") && entry[calendar.CLASSIFICATION] == "PRIVATE"))
        enabled = true;
}
a.rs(enabled);