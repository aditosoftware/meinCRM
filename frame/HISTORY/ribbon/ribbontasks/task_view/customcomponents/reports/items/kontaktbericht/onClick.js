import("lib_attr");
import("lib_report");
import("lib_addr");
import("lib_history");
import("lib_themetree");
import("lib_calendar");
import("lib_keyword");

var clientid = a.valueof("$sys.clientid");
var hid = a.valueof("$comp.historyid");
var frameid = a.valueof("$image.FrameID");
var relid = a.sql("select ROW_ID from HISTORYLINK where OBJECT_ID = 1 and HISTORY_ID = '" + hid + "'") // ORG

var persons = "";
var pers = a.sql("select ROW_ID from HISTORYLINK where OBJECT_ID in ( 3, 2 ) and HISTORY_ID = '" + hid + "'", a.SQL_COLUMN)  //  Person
for (i=0; i<pers.length; i++)
{
    persons += new AddrObject( pers[i] ).formatAddress("{sa} {ti} {fn} {ln}") + "\n";
}
var rpt = "RPT_HISTORY";
if (a.valueof("$comp.MEDIUM") == 2) var art = "Besuchsbericht"; else art = "Kontaktbericht";
var attr = GetAttribute( "", frameid, hid, true ).join("\n") + "\n";
if ( relid != "" ) 
    var c1 = new AddrObject( relid ).getFormattedAddress();
else c1 = "";

// Themenbaum
var arr = getThemes(a.valueof("$comp.historyid"))
var list = []
for (i=0; i<arr.length; i++)
{
    list.push([arr[i][1] + " : " + arr[i][2] ])
}

var subdata = getTasks4Subreport("HISTORY", hid); //Subreport: Aufgaben

//Felder und Daten für Folgebericht
var folgehist = a.valueof("$comp.HISTORY_ID"); //wird für Folgehistoriendaten benötigt
var fields = ["ENTRYDATUM", "BETREFF", "INFO", "MEDIUM", "DIRECTION", "FIRSTNAMELASTNAME"];
var daten = a.sql("select ENTRYDATE, SUBJECT, INFO, " + getKeySQL("HistoryMedium", "MEDIUM") + ", DIRECTION, "
    + concat(["FIRSTNAME", "''", "LASTNAME"])
    + " from HISTORY "
    + "join RELATION on RELATIONID = RELATION_ID "
    + "join PERS on PERS_ID = PERSID where HISTORY_ID = '"+ folgehist +"'", a.SQL_COMPLETE);

for(var l = 0; l < daten.length; l++) //Datum muss bereits hier formatiert werden.
{
    daten[l][0] = date.longToDate(daten[l][0], "dd.MM.yyyy");
}
var subdaten = getSubReportMap(fields, daten); // Subreport: Berichtsfolge

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["Berichtsart"] = a.translate(art);
params["HISTAddr"] = c1;
params["HISTAttr"] = attr;
params["HISTPartner"] = persons;
params["THEME"] = list.join("\n");
params["CLIENTID"] = clientid;
params["adito.datasource.subdata"] = subdata; //Aufgaben
params["adito.datasource.subdata2"] = subdaten; //Berichtsfolge

//Felder und Daten für Hauptbericht:
var rptfields = ["HISTORYID", "ENTRYDATE", "SUBJECT", "INFO", "USER_NEW", "HISTORY_ID"];
var data = a.sql("select HISTORYID, ENTRYDATE, SUBJECT, INFO, USER_NEW, HISTORY_ID "
    + "from HISTORY where HISTORYID = '"+ hid +"'", a.SQL_COMPLETE);
for(var k = 0; k < data.length; k++ )
{
    data[k][1] = date.longToDate(data[k][1], "dd. MMMMM yyyy");
}

a.openStaticLinkedReport("RPTJ_HISTORY", false, a.REPORT_OPEN, null, params, rptfields, data );