import("lib_sql");

a.rs("EVENTID, " + concat([ cast("EVENTNUMBER", "varchar", 10) , "'-'", "TITLE"]) 
	+ " as Anzeige, EVENTNUMBER , TITLE");