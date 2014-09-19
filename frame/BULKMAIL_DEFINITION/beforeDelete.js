var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
// Rechte
toDel.push(new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
// Posten
toDel.push( new Array("BULKMAILRCPT", "BULKMAILDEF_ID = '" + id + "'"));

a.sqlDelete(toDel);