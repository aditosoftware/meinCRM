import("lib_report");
var id = a.valueof("$comp.idcolumn"); 

//Daten für den bericht
var columnNames = ["EVENTPARTICIPANTID", "EVENTID", "EVENTNUMBER", "EVENT.TITLE", "EVENTPARTICIPANT.EPFUNCTION", "CHARGEPART", "DISCOUNTPART", "FIRSTNAME", "LASTNAME" ];

var rptdata = a.sql("select " + columnNames.join(", ") + ", (select sum(COSTVALUE) from EVENTCOST where EVENTCOST.EVENT_ID = EVENTID) from EVENT "
    + "join EVENTPARTICIPANT on EVENTID = EVENTPARTICIPANT.EVENT_ID "
    + "join RELATION on EVENTPARTICIPANT.RELATION_ID = RELATIONID "
    + "join PERS on PERS_ID = PERSID "
    + "where EVENTID = '" + id + "' ", a.SQL_COMPLETE);

columnNames.push("SUMCOSTS");

//Hauptbericht
var params = new Array;

    //header
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

//Unterbericht
var columnNamesSubRep = ["costtype", "costvalue"];
var rptDataSubRep = a.sql("select "+ columnNamesSubRep.join(", ")+" from eventcost where event_id = '" + id + "'", a.SQL_COMPLETE);
    
//parameter an subreport
var subdata = getSubReportMap( columnNamesSubRep, rptDataSubRep) ; 

params["adito.datasource.subdata"] = subdata;

a.openStaticLinkedReport("RPTJ_EVENTCOST", false, a.REPORT_OPEN, null, params, columnNames, rptdata)
