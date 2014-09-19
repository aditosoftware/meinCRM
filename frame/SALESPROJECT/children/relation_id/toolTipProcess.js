import("lib_addr")

var relationid = a.valueof("$comp.RELATION_ID");
if(relationid != "") a.rs(new AddrObject( relationid ).getFormattedAddress());