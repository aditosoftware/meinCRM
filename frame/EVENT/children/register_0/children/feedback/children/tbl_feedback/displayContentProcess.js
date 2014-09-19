var eventid = a.valueof("$comp.EVENTID");

if (eventid != '')
    a.rq("select FEEDBACKID, PARTICIPANT, FRAGE, NOTE, INFO from FEEDBACK where EVENT_ID = '" 
        + eventid + "' order by PARTICIPANT");
else a.rq(a.EMPTY_TABLE_SQL)