import("lib_keyword");

a.rs( a.translate(a.sql("select KEYNAME1 from KEYWORD where" + getKeyTypeSQL("SOURCE") +" and KEYDESCRIPTION like 'default'")));