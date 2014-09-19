import("lib_offerorder");

var item = a.valueof("$comp.Table_Items");

a.rs( a.valueof("$comp.cmb_Status") == "" && item != '' && canMoveItemPos( "$comp.Table_Items", "OFFERITEM", "OFFER_ID = '" + a.valueof("$comp.idcolumn") + "'", 1 ) );