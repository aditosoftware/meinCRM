var id =  a.decodeFirst(a.valueof("$comp.tbl_AufgabeEskalation"))

if ( id != "" && a.hasvar("$image.editableToDo") && a.valueofObj("$image.editableToDo") ) 
{
    var prompts = [];
    prompts["window"] = a.valueof("$sys.currentwindow");
    prompts["image"] = a.valueof("$sys.currentimage");
    prompts["refresh"] = "$comp.tbl_Aufgabe";
    calendar.openEntry(id , false, prompts);
} 
