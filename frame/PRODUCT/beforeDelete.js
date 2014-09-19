var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
// Rechte
toDel.push(new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
// Attribute
toDel.push( new Array("attrlink", "OBJECT_ID = " + a.valueofObj("$image.FrameID") + " and row_id = '" + id + "'"));
// Stückliste
toDel.push( new Array("PROD2PROD", "SOURCE_ID = '" + id + "'"));
// Preisliste
toDel.push( new Array("PRODUCTPRICE", "PRODUCT_ID = '" + id + "'"));
// Lagerbestand
toDel.push( new Array("STOCK", "PRODUCT_ID = '" + id + "'"));

a.sqlDelete(toDel);