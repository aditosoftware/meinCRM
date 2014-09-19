var impdate = date.longToDate(a.valueof("$comp.IMPORTDATE"),"dd.mm.yyyy");

a.rs(a.valueof("$comp.NAME") + ": " + impdate);