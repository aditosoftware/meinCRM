import("lib_keyword");

a.rq("select distinct SALUTATION from SALUTATION where SALUTATION is not NULL and LANGUAGE = "
    + " (select KEYVALUE from KEYWORD where" + getKeyTypeSQL("SPRACHE") + " and KEYDESCRIPTION like 'default')");