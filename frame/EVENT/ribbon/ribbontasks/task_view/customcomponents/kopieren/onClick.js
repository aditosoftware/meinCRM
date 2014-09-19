var id = a.valueof("$comp.EVENTID");

// Eventnummer generieren
var maxevent = a.sql("select max(EVENTNUMBER) + 1 from EVENT");
if (maxevent == '') maxevent = 1;

// Event kopieren
var head = a.sql("select TITLE, SUBTITLE1, SUBTITLE2, SUBTITLE3, DESCRIPTION, CATEGORY, CHARGE, EVENTACTIVE, "
	+ " EVENTSTATUS, LOCATION, MAX_PARTICIPANTS, MODULE, RELATION_ID, EVENT_ID, INTERN, FOLDER "
	+ " FROM EVENT WHERE EVENTID = '" + id + "'", a.SQL_ROW);

// Teilnehmer kopieren
var ids = a.decodeMS(a.valueof("$comp.tbl_participants"));
if (ids.length > 0) ids = " and EVENTPARTICIPANTID in ('" + ids.join("','") + "')"; 
else ids = "";
var item = a.sql("select ACCESSDATE, STATUS, EPFUNCTION, DISCOUNTPART, CHARGEPART, RELATION_ID "
	+ " from EVENTPARTICIPANT "
	+ " where EVENT_ID = '" + id + "' " + ids + " order by EPFUNCTION", a.SQL_COMPLETE);

var prompts = new Array();
var defaultvalue = new Array();
defaultvalue["$comp.TITLE"] = head[0];
defaultvalue["$comp.SUBTITLE1"] = head[1];
defaultvalue["$comp.SUBTITLE2"] = head[2];
defaultvalue["$comp.SUBTITLE3"] = head[3];
defaultvalue["$comp.DESCRIPTION"] = head[4];
defaultvalue["$comp.CATEGORY"] = head[5];
defaultvalue["$comp.CHARGE"] = head[6];
defaultvalue["$comp.EVENTACTIVE"] = head[7];
defaultvalue["$comp.EVENTSTATUS"] = head[8];
defaultvalue["$comp.LOCATION"] = head[9];
defaultvalue["$comp.MAX_PARTICIPANTS"] = head[10];
defaultvalue["$comp.MODULE"] = head[11];
defaultvalue["$comp.RELATION_ID"] = head[12];
defaultvalue["$comp.EVENT_ID"] = head[13];
defaultvalue["$comp.INTERN"] = head[14];
defaultvalue["$comp.FOLDER"] = head[15];
defaultvalue["$comp.EVENTNUMBER"] = maxevent;
prompts["DefaultValues"] = defaultvalue;
prompts["positions"] = item;
prompts["autoclose"] =  false;

a.openLinkedFrame("EVENT", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);