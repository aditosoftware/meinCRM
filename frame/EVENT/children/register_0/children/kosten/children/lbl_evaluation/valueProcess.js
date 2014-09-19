var eventid = a.valueof("$comp.idcolumn");

if (eventid != '')
{
    var sqltn = a.sql("select count(*), sum(CHARGEPART)  from EVENTPARTICIPANT "
    //var sqltn = a.sql("select count(*), sum(CHARGEPART * (100 - DISCOUNTPART) / 100)  from EVENTPARTICIPANT "
        + " where EVENT_ID = '" + eventid + "' and EPFUNCTION = 3", a.SQL_ROW);
    var sqlcost = a.sql("select sum(costvalue) from eventcost where event_id = '" + eventid + "'");
    a.imagevar("$image.evaluation", [sqltn[0], sqltn[1], sqlcost])
}
else 	a.imagevar("$image.evaluation", ["", "", ""])