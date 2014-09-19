import("lib_keyword");

var quest = a.sql("select QUESTIONTEXT from QUESTION where QUESTIONNAIRE_ID = '" + a.valueof("$comp.cmb_fragebogen") + "'", a.SQL_COLUMN);
var registered = a.sql("select count(EVENTPARTICIPANTID) from EVENTPARTICIPANT where STATUS = 2 and EVENT_ID = '" + a.valueof("$comp.idcolumn") + "'"); // 2 = angemeldet
for (i=0; i<quest.length; i++)
{
    for (j=1; j<parseInt(registered)+1; j++)
    {
        var id = a.addTableRow("$comp.tbl_feedback");
        a.updateTableCell("$comp.tbl_feedback", id, 1, 'Teilnehmer'+j, 'Teilnehmer'+j)
        a.updateTableCell("$comp.tbl_feedback", id, 2, quest[i], quest[i])
    }
}