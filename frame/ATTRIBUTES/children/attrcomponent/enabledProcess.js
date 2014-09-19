var attr_id = a.valueof("$comp.attr_id");
var attrid = ""; 
if (attr_id != "") attrid = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + attr_id + "'");
a.rs(attr_id == "" || attrid == "0");