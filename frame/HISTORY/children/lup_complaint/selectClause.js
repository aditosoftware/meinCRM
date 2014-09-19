import("lib_sql");

a.rs("COMPLAINTID, " + concat([ cast("COMPLAINTNUMBER", "varchar", 10) , "'-'", "SUBJECT"]) 
	+ " as Anzeige, COMPLAINTNUMBER , SUBJECT");