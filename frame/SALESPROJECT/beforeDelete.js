var id = a.valueof("$comp.idcolumn");

var toDel = new Array();
// Rechte
toDel.push( new Array("tableaccess", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
// Attribute
toDel.push( new Array("attrlink", "OBJECT_ID = " + a.valueofObj("$image.FrameID") + " and row_id = '" + id + "'"));
// Projektmitglieder
toDel.push( new Array("SPMEMBER", "SALESPROJECT_ID = '" + id + "'" ));
// Mitbewerber
toDel.push( new Array("SPCOMPETITION", "SALESPROJECT_ID = '" + id + "'"));
// SPCYCLE
toDel.push( new Array("SPCYCLE", "SALESPROJECT_ID = '" + id + "'"));
// Herkunftliste
toDel.push( new Array("SPSOURCES", "SALESPROJECT_ID = '" + id + "'"));
// Ausschreibungen
toDel.push( new Array("SPTENDER", "SALESPROJECT_ID = '" + id + "'"));
// Forecast
toDel.push( new Array("SPFORECAST", "SALESPROJECT_ID = '" + id + "'"));
// History
toDel.push( new Array("HISTORYLINK", "OBJECT_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));
// Timetracking
toDel.push( new Array("TIMETRACKING", "OBJECT_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + id + "'"));

a.sqlDelete(toDel);