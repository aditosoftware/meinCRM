import("lib_keyword");

a.rs( a.sql("select KEYVALUE from KEYWORD where" + getKeyTypeSQL("HistoryMedium") + " and KEYDESCRIPTION like 'default'"));