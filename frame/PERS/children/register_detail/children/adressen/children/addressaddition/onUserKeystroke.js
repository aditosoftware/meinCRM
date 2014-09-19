var keystroke = a.valueof("$local.keystroke"); 

switch(keystroke)
{
    case "pressed ENTER":
        a.setFocus("$comp.tbl_ADDRESS");
        a.setTableSelectionRelative("$comp.tbl_ADDRESS", 0, 1, 0 );
        break;
    case "pressed HOME":
        a.setFocus("$comp.tbl_ADDRESS");
        a.setTableSelection("$comp.tbl_ADDRESS",a.decodeMS(a.valueof("$comp.tbl_ADDRESS")),false, 1, 0 );
        break;
    case "pressed END":
        a.setFocus("$comp.tbl_ADDRESS");
        a.setTableSelection("$comp.tbl_ADDRESS",a.decodeMS(a.valueof("$comp.tbl_ADDRESS")),false, 11, 0 );
        break;
}