var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
toDel.push(new Array("TABLEACCESS", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
toDel.push(new Array("EVENTCOST", "EVENT_ID = '" + id + "'"));
toDel.push(new Array("EVENTPARTICIPANT", "EVENT_ID = '" + id + "'"));
toDel.push(new Array("FEEDBACK", "EVENT_ID = '" + id + "'"));

a.sqlDelete(toDel)