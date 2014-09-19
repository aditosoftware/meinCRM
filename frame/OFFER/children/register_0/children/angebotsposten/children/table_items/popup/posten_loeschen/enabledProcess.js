var mode = a.valueof("$sys.workingmode");
var item = a.valueof("$comp.Table_Items");

a.rs( a.valueof("$comp.cmb_Status") == "" && mode == a.FRAMEMODE_EDIT && item != '');