import("lib_keyword");

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_TABLE)
    a.returnobject( getKeyList( "AdressTyp", ["KEYVALUE", "KEYNAME1"], 1, "KEYNAME2 in ('2', '3')" ) );
else
    a.returnobject( getKeyList( "AdressTyp", ["KEYVALUE", "KEYNAME1"], 1, "KEYNAME2 = '" + a.valueof("$comp.AOTYPE") + "'" ) );