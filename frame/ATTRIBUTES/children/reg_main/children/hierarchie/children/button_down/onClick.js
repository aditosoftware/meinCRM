import("lib_util");

moveRow("ATTR", "$comp.tbl_subAttr", "ATTRSORT", "down", "ATTR_ID = '" + a.valueof("$comp.attrid") + "'" );
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");