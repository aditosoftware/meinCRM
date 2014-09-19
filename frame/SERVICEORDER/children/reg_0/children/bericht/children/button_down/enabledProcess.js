import("lib_util");

a.rs(  moveActive("SERVICEITEM", "$comp.Table_Items", "ITEMSORT", "down", "SERVICEITEM.SERVICEORDER_ID = '" + a.valueof("$comp.idcolumn") + "'" ) );