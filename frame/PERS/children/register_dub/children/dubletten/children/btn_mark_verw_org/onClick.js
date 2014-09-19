import("lib_util");

var orgid = a.valueof("$comp.lup_orgid");
var selectedrelid = a.decodeFirst(a.valueof("$comp.tbl_dubletten"));
var sel = a.sql("select ORG_ID, PERS_ID from RELATION where RELATIONID = '" + selectedrelid + "'", a.SQL_ROW);

a.imagevar("$image.dupids", "");
// Wenn die funktion nicht zur gleichen ORG verknüpft ist
if ( trim(orgid) != trim(sel[0]))
{
    // Die Funktion zur ausgewählten Person wird eingetragen
    var persidold = a.valueof("$comp.persid")
    a.setValue("$comp.DUP_CHECK", "1");
    a.doAction(ACTION.FRAME_SAVE);
    selectedrelid = a.valueof("$comp.relationid");
    a.sqlUpdate("RELATION", ["PERS_ID"], a.getColumnTypes("RELATION", ["PERS_ID"]), [sel[1]], "RELATIONID = '" + selectedrelid + "'");
    a.sqlDelete("PERS", "PERSID = '" + persidold + "'");
}
else
{
    a.doAction(ACTION.FRAME_CANCEL);
}
a.closeCurrentTopImage();
a.openFrame("PERS", "RELATIONID = '" + selectedrelid + "'", false, a.FRAMEMODE_SHOW);