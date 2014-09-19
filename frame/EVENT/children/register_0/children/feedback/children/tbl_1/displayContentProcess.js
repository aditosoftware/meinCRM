var eventid = a.valueof("$comp.EVENTID");

if (eventid != '')
    a.rq("select FRAGE, cast(sum(NOTE) as numeric(4,2)) / count(NOTE) from FEEDBACK where EVENT_ID = '" + eventid + "' group by FRAGE");
else a.rq(a.EMPTY_TABLE_SQL)