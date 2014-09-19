var column = a.decodeFirst(a.valueof("$comp.classification"));

if ( column != "" )
{
    a.updateTableCell("$comp.classification", column, 5 , "", "");
}