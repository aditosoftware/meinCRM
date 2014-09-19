import("lib_email");

var pids = a.decodeMS(a.valueof("$comp.tbl_participants"));
var adresse = a.sql("select ADDR from COMM join EVENTPARTICIPANT on COMM.RELATION_ID = EVENTPARTICIPANT.RELATION_ID "
    + " where EVENTPARTICIPANTID in ('" + pids.join("','") + "') and MEDIUM_ID in (3)" , a.SQL_COLUMN );
var partrelid = a.sql("select RELATION_ID from EVENTPARTICIPANT where EVENTPARTICIPANTID = '" + a.decodeFirst(a.valueof("$comp.tbl_participants")) + "'");

OpenNewMail( adresse.join(", "), partrelid, 1 );