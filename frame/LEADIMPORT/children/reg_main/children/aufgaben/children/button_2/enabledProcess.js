var toDo_id = a.decodeFirst(a.valueof("$comp.tbl_Aufgabe"));
var status = a.sql("select status from asys_calendar where entryuid = '" + toDo_id + "'");


a.rs(status != 'COMPLETED')