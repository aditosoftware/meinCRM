import("lib_util");

moveRow("KEYWORD", "$comp.tbl_hierarchie", "KEYSORT", "up", "KEYTYPE = " + a.valueof("$comp.keyvalue"));
a.refresh("$comp.Button_up");
a.refresh("$comp.Button_down");