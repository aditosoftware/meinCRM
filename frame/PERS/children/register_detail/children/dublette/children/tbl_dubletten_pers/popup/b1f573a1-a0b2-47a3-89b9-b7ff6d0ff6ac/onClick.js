import("lib_duplicate")

var relid1 = a.valueof("$comp.persid");
var relid2 = a.sql("select PERS_ID from RELATION where RELATIONID = '" + a.decodeFirst(a.valueof("$comp.tbl_dubletten_pers")) + "'");

noduplicate (relid1, relid2);

a.refresh();