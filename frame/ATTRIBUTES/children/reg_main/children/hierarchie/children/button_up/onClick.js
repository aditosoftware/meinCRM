import("lib_util");

moveRow("ATTR", "$comp.tbl_subAttr", "ATTRSORT", "up", "ATTR_ID = '" + a.valueof("$comp.attrid") + "'");
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");