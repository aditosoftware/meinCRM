import("lib_sql");
import("lib_keyword");

a.rs("CONTRACTID, " + concat([ cast("CONTRACTCODE", "varchar", 10), getKeySQL("CONTRACTTYPE", "CONTRACTTYPE" ) ]) 
	+ " as anzeige, CONTRACTCODE, " + getKeySQL("CONTRACTTYPE", "CONTRACTTYPE" ));