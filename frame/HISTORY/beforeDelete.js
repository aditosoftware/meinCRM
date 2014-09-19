var id = a.valueof("$comp.historyid");

var toDel = new Array();
toDel.push( new Array("TABLEACCESS", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
toDel.push( new Array("HISTORYLINK", "HISTORY_ID = '" + id + "'"));
toDel.push( new Array("HISTORY_THEME", "HISTORY_ID = '" + id + "'"));
toDel.push( new Array("ATTRLINK", "OBJECT_ID = " + a.valueof("$image.FrameID") + " and ROW_ID = '" + id + "'"));

a.sqlDelete(toDel);