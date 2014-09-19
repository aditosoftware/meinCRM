var sio = "1";
var p2pid = a.valueof("$comp.lbl_partlist_prod2prod");
if (p2pid != "")	sio = a.sql("select OPTIONAL from PROD2PROD where PROD2PRODID = '" + p2pid + "'");
a.rs(sio);