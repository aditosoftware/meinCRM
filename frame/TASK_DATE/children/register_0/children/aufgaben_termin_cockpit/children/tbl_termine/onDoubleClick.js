var id =  a.decodeFirst(a.valueof("$comp.tbl_Termine"))

if ( id != "" && a.hasvar("$image.editableEvent") && a.valueofObj("$image.editableEvent") ) 
{
    var prompts = [];
    prompts["window"] = a.valueof("$sys.currentwindow");
    prompts["image"] = a.valueof("$sys.currentimage");
    prompts["refresh"] = "$comp.tbl_Termine";
    calendar.openEntry(id , false, prompts);
} 