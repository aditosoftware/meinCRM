var id =  a.decodeFirst(a.valueof("$comp.tbl_Aufgabe"));
var entry = calendar.getEntry(id)[0];

entry[calendar.STATUS] = calendar.STATUS_COMPLETED;
calendar.update(new Array(entry));

a.doAction(ACTION.FRAME_UPDATE);