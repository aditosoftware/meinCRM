import("lib_modul");

if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW )
    a.ro(getModule("PERS_ID = '" + a.valueof("$comp.persid") + "'", a.decodeMS(a.valueof("$comp.Liste_modul")), a.decodeMS(a.valueof("$comp.Liste_year")), a.valueof("$comp.relationid")));