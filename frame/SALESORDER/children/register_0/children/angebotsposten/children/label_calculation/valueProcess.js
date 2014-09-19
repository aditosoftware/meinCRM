import("lib_tablecomp");

var mode =  a.valueof("$sys.workingmode")
if( mode == a.FRAMEMODE_EDIT || mode == a.FRAMEMODE_NEW )   setTableIndex("$comp.Table_Items", "1");