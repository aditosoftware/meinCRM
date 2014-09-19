import("lib_sql");

a.rs("relationid," // ID-Spalte
  + concat( [ concat(["SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME"]) , "ORGNAME"], " - " ) +  " as anzeige, "
	+ "orgname, zip, city, title, firstname, lastname, reltitle"); // Auswahlspalten