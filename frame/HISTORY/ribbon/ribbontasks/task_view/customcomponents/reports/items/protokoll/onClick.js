import("lib_report");
import("lib_addr");
import("lib_history");

var clientid = a.valueof("$sys.clientid");
var hid = a.valueof("$comp.historyid");
var frameid = a.valueof("$image.FrameID");
var relid = a.sql("select ROW_ID from HISTORYLINK where OBJECT_ID = 1 and HISTORY_ID = '" + hid + "'") // ORG

var persons = "";
var pers = a.sql("select ROW_ID from HISTORYLINK where OBJECT_ID in ( 3, 2 ) and HISTORY_ID = '" + hid + "'", a.SQL_COLUMN)  //  Person
for (i=0; i<pers.length; i++)	persons += new AddrObject( pers[i] ).formatAddress("{sa} {ti} {fn} {ln}") + "\n";
var rpt = "RPT_HISTORY_HANDOUT";
if ( relid != "" )	var c1 = new AddrObject( relid ).getFormattedAddress();
else c1 = "";

var info = a.valueof("$comp.INFO");
var start = info.indexOf("###")
if (start > -1) info = info.substr(0, start);
var art = "";
switch(a.valueof("$comp.MEDIUM"))
{
    case "1":
        art = "Gesprächsprotokoll vom";
        break;
    case "2":
        art = "Besuchsprotokoll vom";
        break;
    case "9":
        art = "Internes Protokoll vom";
        break;
}
var sender = a.sql("select " + concat(["FIRSTNAME", "LASTNAME"]) 
    + " from PERS join RELATION on PERSID = PERS_ID where RELATIONID = '" + a.valueof("$global.user_relationid") + "'") ;
var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["Berichtsart"] = a.translate(art) + " " + date.longToDate(a.valueof("$comp.ENTRYDATE"), "dd.MM.yyyy");
params["sender"] = sender;
params["HISTAddr"] = c1;
params["HISTPartner"] = persons;
params["CLIENTID"] = clientid;
params["Info"] = info;

//Reportdata
var columnNames = ["SUBJECT", "HISTORY_ID"];
var data = a.sql("select SUBJECT, HISTORY_ID from HISTORY where HISTORYID = '"+ hid +"'", a.SQL_COMPLETE);

a.openStaticLinkedReport("RPTJ_HISTORY_HANDOUT", false, a.REPORT_OPEN, null, params, columnNames, data)
var pdfpath =  a.valueof("$sys.clienttemp") + "/Protokoll.pdf";
a.globalvar("$global.RptHistoryDetails", ["vom " + date.longToDate(a.valueof("$comp.ENTRYDATE"), "dd.MM.yyyy"), relid, pdfpath, hid]);
a.openStaticLinkedReport("RPTJ_HISTORY_HANDOUT", false, a.REPORT_EXPORT, [a.REPORT_EXPORT_PDF, pdfpath], params, columnNames, data);
