import("lib_attr");

var prompts = new Array();
prompts["ID"] =  a.valueof("$comp.orgid");
prompts["STANDARDADDRESS"] =  a.valueof("$comp.ADDRESS_ID");
prompts["comp4refresh"] = "$comp.Table_pers";
prompts["autoclose"] =  true;

// Vorbelegung von Telefon und Email
var id = a.valueof("$comp.relationid");
var tel = a.sql("select ADDR from COMM where RELATION_ID = '" + id + "' and MEDIUM_ID = 1 and STANDARD = 1");
var email = a.sql("select ADDR from COMM where RELATION_ID = '" + id + "' and MEDIUM_ID = 3 and STANDARD = 1");
var comm = [[tel, "1", id, "1"], [email, "3", id, "1"]];
prompts["comm"] = comm;

prompts["language"] = a.valueof("$comp.LANG");
a.openLinkedFrame("PERS", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);