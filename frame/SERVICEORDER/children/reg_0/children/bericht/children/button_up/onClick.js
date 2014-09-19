import("lib_util");

moveRow("SERVICEITEM", "$comp.Table_Items", "ITEMSORT", "up", "SERVICEORDER_ID = '" + a.valueof("$comp.idcolumn")+ "'");
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");