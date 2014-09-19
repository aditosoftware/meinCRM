import("lib_telephony");

// get me the number...
var ctilogid = a.decodeFirst(a.valueof("$comp.tbl_calls"));
var adresse = a.sql("SELECT ADDRESS FROM CTILOG WHERE CTILOGID = '" + ctilogid + "'");
call(adresse);