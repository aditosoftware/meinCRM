import("lib_sql");
import("lib_keyword");
import("lib_event")

var list = [];
var eventid = a.valueof("$comp.EVENTID");
var filter = computePartCondition();
if (filter != '') filter = " and " + filter

if (eventid != '')
{
    list = a.sql("select EVENTPARTICIPANTID, "
        + " CASE WHEN EPFUNCTION = 1 THEN -65536 "	// rot 
        + " ELSE ( CASE  WHEN EPFUNCTION = 2 THEN -16738048 "	// grün 
        + " ELSE -16776961 END) END, "	// blau 
        + " ACCESSDATE, "
        + getKeySQL( "EVENTPARTSTATUS", "EVENTPARTICIPANT.STATUS" ) + ", "
        + getKeySQL( "EVENTPARTFUNC", "EPFUNCTION" ) + ", "
        + " DISCOUNTPART, CHARGEPART, "
        + concat(new Array("salutation", "firstname", "lastname", "' - '", "orgname")) 
        + " from EVENTPARTICIPANT join relation on (relationid = relation_id) join pers on (persid = pers_id) "
        + " join org on (orgid = org_id) where "
        + "EVENT_ID = '" + eventid + "'" + filter + " order by EPFUNCTION", a.SQL_COMPLETE);
}
if (list == '') list = a.createEmptyTable(9)
a.ro(list);