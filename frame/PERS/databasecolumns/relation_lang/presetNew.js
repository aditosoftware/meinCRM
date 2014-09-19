import("lib_keyword");

if ( a.valueof("$sys.superframe") == "ORG" )
{
    a.rs( a.valueof("$image.language") );
}
else
{
    a.rs( a.sql("select KEYVALUE from KEYWORD where" + getKeyTypeSQL("SPRACHE") + " and KEYDESCRIPTION like 'default'"));
}