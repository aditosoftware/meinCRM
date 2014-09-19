import("lib_offerorder");

moveItemPos( "$comp.Table_Items", "OFFERITEM", "OFFER_ID = '" + a.valueof("$comp.idcolumn") + "'", + 1 );
a.refresh("$comp.Button_down");
a.refresh("$comp.Button_up");