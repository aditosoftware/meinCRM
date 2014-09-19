var id = a.valueof("$comp.idcolumn");
var toDel = new Array();
// Rechte
toDel.push(new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
// ATTROBJECT
toDel.push(new Array("ATTROBJECT", "ATTR_ID = '" + id + "'"));
// gelinkte Atribute
toDel.push(new Array("ATTR", "ATTR_ID = '" + id + "'"));

a.sqlDelete(toDel);