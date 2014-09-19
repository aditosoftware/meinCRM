import("lib_offerorder");

deleteItemPos( "$comp.Table_Items", "OFFERITEM", "OFFER_ID = '" + a.valueof("$comp.idcolumn") + "'" );
a.refresh("$comp.NET");