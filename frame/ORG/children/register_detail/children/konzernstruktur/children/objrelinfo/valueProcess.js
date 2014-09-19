ret = "";
var objrelid = a.decodeMS(a.valueof("$comp.relTree"))[1];
if ( objrelid != "" ) ret = a.sql("select RELDESC from OBJECTRELATION where OBJECTRELATIONID = '" + objrelid + "'");
a.rs(ret);