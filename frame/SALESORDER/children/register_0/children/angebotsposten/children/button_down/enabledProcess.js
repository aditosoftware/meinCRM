import("lib_util");

a.rs(  moveActive("ORDERITEM", "$comp.Table_Items", "ITEMSORT", "down", "SALESORDER_ID = '" + a.valueof("$comp.idcolumn") + "'" ) );