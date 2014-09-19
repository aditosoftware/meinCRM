import("lib_sql");

 
a.rs("relationid, " + cast(concat(new Array("lastname", "firstname") ),"varchar", 60) + " as show, lastname, firstname");