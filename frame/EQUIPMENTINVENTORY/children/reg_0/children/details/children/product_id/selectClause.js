import("lib_sql")

a.rs("PRODUCTID, " + concat(["PRODUCTCODE", "'/'", "PRODUCTNAME"]) + " as anzeige, PRODUCTCODE, PRODUCTNAME");