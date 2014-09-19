var id = a.decodeFirst(a.valueof("$comp.tbl_ADDRESS"));
a.openFrame("PERS", "RELATIONID = '" + id.split("#")[1] + "'", false, a.FRAMEMODE_SHOW);