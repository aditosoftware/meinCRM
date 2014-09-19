import("lib_sql")

var id = a.valueof("$comp.idcolumn");
		
var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

var data = a.sql("select (select " + concat(["salutation", "firstname", "lastname"]) 
	+ " from pers join relation on (persid = pers_id) where relationid = EVENTPARTICIPANT.RELATION_ID), "
	+ " (select orgname from org join relation on (orgid = org_id) where relationid = EVENTPARTICIPANT.RELATION_ID)"
	+ " from EVENTPARTICIPANT where EVENT_ID = '" + id + "'", a.SQL_COMPLETE);

var rptfields = ["PARTICIPANT", "COMPANY"];

a.openStaticLinkedReport("RPTJ_EVENTPARTTABLE", false, a.REPORT_OPEN, null, params, rptfields, data );