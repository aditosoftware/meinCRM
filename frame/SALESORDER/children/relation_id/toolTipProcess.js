import("lib_addr")

var relationid = a.valueof("$comp.RELATION_ID");
if(relationid != "" && a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW) a.rs(new AddrObject( relationid ).getFormattedAddress());