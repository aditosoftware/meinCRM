import("lib_sql")

var id = a.valueof("$comp.idcolumn");
		
var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
var array = params["myAddr"].split(" | "); 
var place = array[2].split(" ");
params["compPlace"] = place[3];
params["compName"] = array[0];

var referent = a.sql("select (select " + concat(["salutation", "firstname", "lastname"]) 
	+ " from pers join relation on (persid = pers_id) where relationid = EVENTPARTICIPANT.RELATION_ID)"
        + " from EVENTPARTICIPANT where EVENT_ID = '" + id + "' and EPFUNCTION = 1", a.SQL_ROW); // veranstalter
if (referent.length > 0) params["referent"] = referent[0].toString(); // da nur ein veranstalter, kann es so formatiert werden
else params["referent"] = "";
var title = a.valueof("$comp.TITLE");
var start = date.longToDate(a.valueof("$comp.EVENTSTART"), "dd.MM.yyyy");
var end = date.longToDate(a.valueof("$comp.EVENTEND"), "dd.MM.yyyy");

data = a.sql("select (select " + concat(["salutation", "firstname", "lastname"]) 
	+ " from pers join relation on (persid = pers_id) where relationid = EVENTPARTICIPANT.RELATION_ID), '" 
	+ title + "', '" + start + "', '" + end 
	+ "' from EVENTPARTICIPANT where EVENT_ID = '" + id + "' and EPFUNCTION != 1", a.SQL_COMPLETE); // keine best�tigung f�r veranstalter

var rptfields = ["PARTICIPANT", "TITLE", "EVENTSTART", "EVENTEND"];

a.openStaticLinkedReport("RPTJ_EVENTPARTCONFIRM", false,a.REPORT_OPEN, null,params, rptfields, data );