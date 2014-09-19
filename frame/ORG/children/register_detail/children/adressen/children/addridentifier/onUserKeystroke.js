var keystroke = a.valueof("$local.keystroke"); 

a.setFocus("$comp.tbl_ADDRESS");
switch(keystroke)
{
    case "pressed ENTER":
        a.setTableSelectionRelative("$comp.tbl_ADDRESS", 0, 1, 0 );
        break;
    case "pressed HOME":
        a.setTableSelection("$comp.tbl_ADDRESS",a.decodeMS(a.valueof("$comp.tbl_ADDRESS")),false, 0, 0 );
        break;
    case "pressed END":
        a.setTableSelection("$comp.tbl_ADDRESS",a.decodeMS(a.valueof("$comp.tbl_ADDRESS")),false, 9, 0 );
        break;
}