import("lib_sql");

a.rs("SALESPROJECTID, " + concat([ cast("PROJECTNUMBER", "varchar", 10) , "'-'", "PROJECTTITLE"]) 
	+ " as Anzeige, PROJECTNUMBER , PROJECTTITLE");