import("lib_duplicate")

var relid1 = a.valueof("$comp.relationid");
var relid2 = a.decodeFirst(a.valueof("$comp.tbl_dubletten_org"));

noduplicate (relid1, relid2);

a.refresh();