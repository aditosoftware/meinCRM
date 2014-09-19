import("lib_util");

moveRow("SERVICEITEM", "$comp.Table_Items", "ITEMSORT", "down", "SERVICEORDER_ID = '" + a.valueof("$comp.idcolumn") + "'");
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");