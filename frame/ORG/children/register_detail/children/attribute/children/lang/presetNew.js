import("lib_keyword");

a.rs( a.sql("select KEYVALUE from KEYWORD where" + getKeyTypeSQL("SPRACHE") +" and KEYDESCRIPTION like 'default'"));