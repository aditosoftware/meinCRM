import("lib_util");

moveRow("ORDERITEM", "$comp.Table_Items", "ITEMSORT", "down", "SALESORDER_ID = '" + a.valueof("$comp.idcolumn") + "'");
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");