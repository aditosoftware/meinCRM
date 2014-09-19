import("lib_keyword");
import("lib_sql")

var id = a.valueof("$comp.idcolumn");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["TITLE"] = a.valueof("$comp.TITLE");
params["EVENTNUMBER"] = a.valueof("$comp.EVENTNUMBER");
params["LOCATION"] = a.valueof("$comp.LOCATION");
params["EVENTSTART"] = date.longToDate(a.valueof("$comp.EVENTSTART"), "dd.MM.yyyy");
params["EVENTEND"] = date.longToDate(a.valueof("$comp.EVENTEND"), "dd.MM.yyyy");

var data = a.sql("select (select " + concat(["salutation", "firstname", "lastname"]) 
	+ " from pers join relation on (persid = pers_id) where relationid = EVENTPARTICIPANT.RELATION_ID), "
	+ " (select orgname from org join relation on (orgid = org_id) where relationid = EVENTPARTICIPANT.RELATION_ID), ACCESSDATE, "
	+ getKeySQL("EVENTPARTSTATUS", "STATUS") + ", " + getKeySQL("EVENTPARTFUNC", "EPFUNCTION") 
	+ " from EVENTPARTICIPANT where EVENT_ID = '" + id + "'", a.SQL_COMPLETE);

for (i=0; i<data.length; i++) data[i][2] = date.longToDate(data[i][2], "dd.MM.yyyy")

var rptfields = ["PARTICIPANT", "COMPANY", "ACCESSDATE", "STATUS", "EPFUNCTION"];

a.openStaticLinkedReport("RPTJ_EVENTPART", false, a.REPORT_OPEN, null, params, rptfields, data );