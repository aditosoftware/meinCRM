var selection = a.valueof("$comp.Table_comm");

if(selection != "")
{
    a.updateTableCell("$comp.Table_comm", a.decodeFirst(a.valueof("$comp.Table_comm")), 3 , "", "");
}