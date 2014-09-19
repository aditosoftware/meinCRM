var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
// Rechte
toDel.push(new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
// Attribute
toDel.push( new Array("attrlink", "OBJECT_ID = 14 and row_id = '" + id + "'"));
// Posten
toDel.push( new Array("ORDERITEM", "SALESORDER_ID = '" + id + "'"));

a.sqlDelete(toDel);