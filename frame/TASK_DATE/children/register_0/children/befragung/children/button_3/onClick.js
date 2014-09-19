// Ermitteln der relids aus der Teilnehmerliste
var relids = "select RELATION_ID from CAMPAIGNPARTICIPANT where CAMPAIGNPARTICIPANTID in ('" 
+ a.decodeMS(a.valueof("$comp.tbl_participants")).join("','") + "')";

// nur die existierenden Fragebögen öffnen
var cond = " QUESTIONNAIRELOG.RELATION_ID in (" + relids + ")";
a.openFrame("QUESTIONNAIRELOG", cond, false, a.FRAMEMODE_TABLE_SELECTION)