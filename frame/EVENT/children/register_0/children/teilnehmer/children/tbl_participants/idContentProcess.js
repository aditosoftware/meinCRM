import("lib_event")

var list = [];
var eventid = a.valueof("$comp.EVENTID");
var filter = computePartCondition();
if (filter != '') filter = " and " + filter

if (eventid != '')
{
    list = a.sql("select EVENTPARTICIPANTID, '', ACCESSDATE, STATUS, EPFUNCTION, DISCOUNTPART, CHARGEPART, RELATION_ID"
        + " from EVENTPARTICIPANT "
        + " where EVENT_ID = '" + eventid + "'" + filter + " order by EPFUNCTION", a.SQL_COMPLETE);
}
if (list == '') list = a.createEmptyTable(9)
a.ro(list);