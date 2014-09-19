var id =  a.decodeFirst(a.valueof("$comp.tbl_Aufgabe"))
var Entry = calendar.getEntry(id)[0];

if ( !(Entry[calendar.USER2]["cn"] != a.valueof("$sys.user") && Entry[calendar.CLASSIFICATION] == "PRIVATE")) 
{
    var prompts = [];
    prompts["window"] = a.valueof("$sys.currentwindow");
    prompts["image"] = a.valueof("$sys.currentimage");
    prompts["refresh"] = "$comp.tbl_Aufgabe";
    calendar.openEntry(id , false, prompts);
} 
