var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
// Rechte
toDel.push(new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
// Attribute
toDel.push( new Array("attrlink", "OBJECT_ID = 17 and row_id = '" + id + "'"));
// Felddefinitionen
toDel.push( new Array("IMPORTFIELDDEV", "IMPORTDEV_ID = '" + id + "'"));

a.sqlDelete(toDel);