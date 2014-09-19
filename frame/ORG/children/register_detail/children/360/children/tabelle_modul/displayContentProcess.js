import("lib_modul");

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW )
    a.ro(getModule( "ORG_ID = '" + a.valueof("$comp.orgid") + "'", a.decodeMS(a.valueof("$comp.Liste_modul")), a.decodeMS(a.valueof("$comp.Liste_year")), a.valueof("$comp.relationid")));