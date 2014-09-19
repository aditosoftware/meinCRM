var tn = a.sql("select count(EVENTPARTICIPANTID) from EVENTPARTICIPANT where STATUS = 2 and EVENT_ID = '" + a.valueof("$comp.idcolumn") + "'");

var list = [];
for (i=0; i<tn.length; i++)
    list.push(["Teilnehmer"+i])
a.ro(list)