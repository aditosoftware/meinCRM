var persid = a.valueof("$comp.persid");
var relid = a.valueof("$comp.relationid");
var aotype = a.valueof("$comp.AOTYPE")

// Wenn mehrere Relation zur Persion vorhanden nur die Relation löschen
if( a.sql("select count(*) from relation where pers_id = '" + persid + "'") > 1 )
    a.setTablesCanBeDeleted(new Array("RELATION"));
else
    a.setTablesCanBeDeleted(new Array("PERS", "RELATION"));

var toDel = new Array();
// Rechte
toDel.push(new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + relid + "'"));
// Attribute
toDel.push( new Array("attrlink", "OBJECT_ID = 2 and row_id = '" + relid + "'"));
// Verteiler
toDel.push( new Array("distlistmember", "relation_id = '" + relid + "'"));
// Kampagnen
toDel.push( new Array("campaignparticipant", "relation_id = '" + relid + "'"));
// Kommunikation
toDel.push( new Array("comm", "relation_id = '" + relid + "'"));
// Veranstaltungsteilnahme
toDel.push( new Array("EVENTPARTICIPANT", "relation_id = '" + relid + "'"));
// Objektbeziehung
toDel.push( new Array("objectrelation", "( source_object = " + aotype + " and source_id = '" + relid + "')" 
    + "  or ( dest_object = " + aotype + " and dest_id = '" + relid + "')"));
// Pers-Relation und Adressenrelationen
toDel.push( new Array("relation", "relationid = '" + relid + "'"));

a.sqlDelete(toDel);