import("lib_sql");
 
a.rs("RELATIONID, " + cast(concat(new Array("FIRSTNAME", "LASTNAME", "', '", "ORGNAME") ),"varchar", 60) 
+ " as anzeige, FIRSTNAME, LASTNAME, ORGNAME ");