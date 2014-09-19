import("lib_sql");

 
a.rs("OFFERID, " + concat([ cast("OFFERCODE", "varchar", 10) , "'-'", cast("VERSNR", "varchar", 10), "ADDRESS"]) 
	+ " as Anzeige, " + concat([ cast("OFFERCODE", "varchar", 10) , "'-'", cast("VERSNR", "varchar", 10)]) 
	+ " , ADDRESS");