import("lib_keyword")

var ordertype = a.valueof("$comp.ORDERTYPE");
var ordercode = a.valueof("$comp.ORDERCODE");
if ( ordertype != '' && ordercode != '') 
    a.rs(getKeyName(ordertype, "ORDERTYPE") + " " + ordercode);