import("lib_sql");

var wann = a.valueof("$comp.comboDate");
var sql = " select optionid, optionname, optionvalue, username, deldate " + 
" from aosys_configuration where deldate is not null ";
if(wann != "") sql += " and " + dayfromdate("deldate") + " = " + date.longToDate(wann, "dd")
    + " and " + monthfromdate("deldate") + " = " + date.longToDate(wann, "MM")
    + " and " + yearfromdate("deldate") + " = " + date.longToDate(wann, "yyyy");
sql += " order by optionname";

a.rq(sql);