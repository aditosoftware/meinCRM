var eventid = a.valueof("$comp.EVENTID");

if (eventid != '')
    a.rq("select EVENTCOSTID, COSTTYPE, COSTVALUE from EVENTCOST where EVENT_ID = '" 
        + eventid + "' order by costtype");
else a.rq(a.EMPTY_TABLE_SQL)