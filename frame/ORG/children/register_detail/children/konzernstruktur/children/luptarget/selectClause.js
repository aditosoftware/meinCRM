import("lib_sql");

a.rs("relationid,"
	+ cast(concat(["orgname", "' - '", "lastname", "firstname"]),"varchar", 255 )
	+ ", orgname, lastname, firstname, ADDRESS.ZIP, ADDRESS.CITY, RELATION.RELTITLE");