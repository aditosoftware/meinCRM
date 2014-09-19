var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
toDel[0] = new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'");
toDel[1] = new Array("tableaccess", "TATYPE = 'F' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'");

a.sqlDelete(toDel)