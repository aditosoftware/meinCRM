import("lib_keyword");

a.rs(a.valueof("$comp.ORDERTYPE") != a.sql("select keyvalue from keyword where keyname1 = 'Auftragsbestätigung' and " 
    + getKeyTypeSQL("ORDERTYPE")))