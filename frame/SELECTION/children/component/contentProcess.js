import("lib_keyword");

// nicht 2.Stufe, Checkbox, SelectCombo
a.rq("select KEYVALUE, KEYNAME1 from keyword where " + getKeyTypeSQL("AttrType") + " and KEYVALUE not in (0, 3, 7)");