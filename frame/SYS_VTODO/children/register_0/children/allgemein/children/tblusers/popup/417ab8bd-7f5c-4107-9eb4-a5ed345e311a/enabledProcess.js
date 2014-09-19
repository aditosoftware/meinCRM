var aktuelleid = a.decodeFirst(a.valueof("$comp.tblUsers"));

a.rs(a.sql("select count(*) from THEME where THEMEID = '" + aktuelleid + "'") < 1);