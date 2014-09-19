import("lib_calendar");

// Verknüpfung zur Historie und - wenn vorhanden - zur verknüpften Firma
var user = [a.valueof("$sys.user")];
var id = a.valueof("$comp.idcolumn");
var titleHist = a.translate("Betreff") + ": " + a.valueof("$comp.SUBJECT");
var relid = a.sql("select max(ROW_ID) from HISTORYLINK where HISTORY_ID = '" + id + "' and OBJECT_ID = 1");
if (relid != "")
{
    var titleOrg = a.sql("select ORGNAME from ORG join RELATION on ORGID = ORG_ID where RELATIONID = '" + relid + "'");
    newTodo( null, null, [["HISTORY", id, titleHist], ["ORG", relid, titleOrg]], null, user );
}
else
    newTodo();