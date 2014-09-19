var orgid = a.valueof("$comp.orgid");
var relid = a.valueof("$comp.relationid");

var toDel = new Array();
// Rechte
toDel.push(new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + relid + "'"));
// Orgrelation und Adressrelationen
toDel.push(new Array("relation", "relation.pers_id is null and relation.org_id = '" + orgid + "'"));
// Kommunikation
toDel.push( new Array("comm", "relation_id = '" + relid + "'"));
// Verteilermitgliedschaften
toDel.push( new Array("distlistmember", "relation_id = '" + relid + "'"));
// Kampagnenteilnahme
toDel.push( new Array("campaignparticipant", "relation_id = '" + relid + "'"));
// Objektbeziehung
toDel.push( new Array("objectrelation", "(source_object = 1 and  source_id = '" + relid + "') or ( dest_object = 1 and dest_id = '" + relid + "')"));
// Attribute
toDel.push( new Array("attrlink", "OBJECT_ID = 1 and row_id = '" + relid + "'"));
// Orgrelation und Adressrelationen
toDel.push(new Array("ADDRESS", "RELATION_ID = '" + relid + "'"));


a.sqlDelete(toDel);