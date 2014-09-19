import("lib_addr")

var relationid = a.valueof("$comp.PRODUCER_ID");
if(relationid != "") a.rs(new AddrObject( relationid ).getFormattedAddress());