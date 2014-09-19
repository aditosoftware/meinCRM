if ( a.valueof("$sys.superframe") == "PERS" )		a.rs( a.valueof("$image.PERSID") );
else a.rs(a.getNewUUID());