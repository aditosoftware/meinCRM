import("lib_frame");
import("lib_keyword");
import("lib_user");
import("lib_calendar");


// konfigurationsobjekt zum lesen vom einstellungen erzeugen
var cfg = new Configuration();

//********** Mandant **********
a.globalvar("$global.mandatorrole", cfg.getOption("sys.mandant"));

//********** Kalender-Rechte vergeben **********
setCalendarGrant();

//********** Globale Einstellungen für das Öffnen von Frames ************
a.globalvar("$global.downwardLink", cfg.getOption("frame.downwardLink"));
a.globalvar("$global.upwardLink", cfg.getOption("frame.upwardLink"));

//********** Globale Einstellungen für verwendeten MailClient ************
a.globalvar("$global.MailClient", cfg.getOption("mail.mailclient"));
a.globalvar("$global.MailClientErrorMailIDs", new Array());
a.globalvar("$global.MailText", a.valueof("$sys.clientos").substr(0, 7));

//********** Globale Einstellungen für das Mailbridge Konto ************
a.globalvar("$global.mailbridge", cfg.getOption("mail.mailbridge.account"));

//********** Globale Einstellungen für Aufruf der Frame-Hilfe ************
a.globalvar("$global.HelpAddr", cfg.getOption("app.helpurl"));

//********** Globale Einstellungen für Export- Serienbrief ************
a.globalvar("$global.Exp_Temp", cfg.getOption("app.exportdir"));

//********** HistoryPopUp für Kampagne ************
a.globalvar("$global.silentHistoryCampaign", cfg.getOption("app.silentHistoryCampaign"));

//********** Support ******************
a.globalvar("$global.intern", "true");

//********** Anzeige Userliste Lastname Firstname ******************
a.globalvar("$global.firstLastName", false);

//********** CTI Einstellungen  ******************
var param = cfg.getOption("cti.Tapi3");
if ( param == "" || param == "Y")	telephony.setPrivateDataCallbackProcess("cti_log");
else telephony.setCallStateChangedProcess("cti_log");

param = cfg.getOption("cti.log");
if ( param == "" )	param = true;
a.globalvar("$global.cti_log", param )
param = cfg.getOption("cti.newhistory");
if ( param == "" )	param = true;
a.globalvar("$global.cti_newhistory", param );
param = cfg.getOption("cti.inlineleadingnumber");
if ( param == "" )	param = false;
a.globalvar("$global.cti_inlineleadingnumber", param );
param = cfg.getOption("cti.outlineleadingnumber");
if ( param == "" )	param = false;
a.globalvar("$global.cti_outlineleadingnumber", param );
param = cfg.getOption("cti.ignoreinterncall");
if ( param == "" )	param = false;
a.globalvar("$global.cti.ignoreinterncall", param );
param = cfg.getOption("cti.open_Frame");
a.globalvar("$global.cti.open_Frame", param );

//********** Globale Einstellungen für das Rollen-/Rechtekonzept **********
// Rollen-/Rechte-System ein-/ausschalten
a.globalvar("$global.useRights", true );
// Sollen Rechte restriktiv gehandhabt werden oder nicht
// restrictive = true -> keine Aussage über ein Objekt bedeutet, dass das Recht nicht vorhanden ist
// restrictive = false -> keine Aussage über ein Objekt bedeutet, dass das Recht vorhanden ist
a.globalvar("$global.restrictive", false);

// Rollen des Benutzers holen und speichern
var userroles = tools.getRoles(a.valueof("$sys.user"));
userroles = userroles.concat(a.sql("select Name from ASYS_USER where TITLE = '" + a.valueof("$sys.user") + "'"));
a.globalvar("$global.userroles", userroles);

// Die Benutzerrolle des Benutzers holen und speichern
for ( var i = 0; i < userroles.length; i++ )
{
    if ( userroles[i].substr( 0, 9) == "_____USER" )
    {
        a.globalvar("$global.userrole", userroles[i]);
        break;		
    }
}

//********** Globale Einstellungen für den User **********
var errmessage = "";
var relid = a.sql("select RELATION_ID from EMPLOYEE join RELATION on RELATION_ID = RELATIONID where LOGIN = '" + a.valueof("$sys.user") + "'");
a.globalvar("$global.user_relationid", relid);
if ( relid != "")
{
    a.globalvar("$global.user_email", a.sql("select ADDR from COMM where MEDIUM_ID in (3, 13) and STANDARD = 1 and RELATION_ID = '" + relid + "'" ) );
    if ( a.valueof("$global.user_email") == "" ) errmessage += a.translate("In Ihrer Kontakperson ist keine Standard E-Mail-Adresse eingetragen") + "\n";
    a.globalvar("$global.user_phone", a.sql("select ADDR from COMM where MEDIUM_ID in (1, 11) and STANDARD = 1 and RELATION_ID = '" + relid + "'" ) );
    if ( a.valueof("$global.user_phone") == "" ) errmessage += a.translate("In Ihrer Kontakperson ist keine Standard Telefonnummer eingetragen") + "\n";
    if ( errmessage != "" )  a.openFrame("PERS", "RELATIONID = '" + relid + "'", false, a.FRAMEMODE_EDIT);
}
else 
{
    a.globalvar("$global.user_email", "");
    a.globalvar("$global.user_phone", "");
    errmessage =  a.translate("mit Ihrem Login ist kein Kontaktperson verknüpft !") + "\n" + a.translate("Wenden Sie sich an Ihren Administrator");
}
if ( errmessage != "" ) a.showMessage(errmessage);

//********** Gebietsermittlung für Aussendienst **********
var sa = a.sql("select KEYVALUE from ATTR join ATTRLINK on ATTRID = ATTRLINK.ATTR_ID join KEYWORD on VALUE_ID = KEYWORDID "
    + "join EMPLOYEE on EMPLOYEEID = ROW_ID where ATTRNAME = 'Gebiet' and RELATION_ID = '" + relid + "' order by KEYSORT", a.SQL_COLUMN);
a.globalvar("$global.user_salesarea", sa );

//********** Globale Einstellungen für Historieneintrag nach erledigt (für Aufgabe) setzen oder zu Termin ************
param = cfg.getOption("app.setCalendarHistory");
if ( param == "" )	param = "true";
a.globalvar("$global.setCalendarHistory", param);

//********** Globale Einstellung für das Anzeigen des LogReiters im Frame **********
param = cfg.getOption("app.showlog");
if ( param == "" )	param = "true";
a.globalvar("$global.showlog", param );

//********** Start-Frame öffnen **********
a.openFrame("TASK_DATE", null, false, a.FRAMEMODE_EDIT);

//********** Info meinCRM öffnen **********
var user = tools.getUser(a.valueof("$sys.user"))
autoStart = user[tools.PARAMS]["autoStart_meinCRM"];
if ( autoStart == undefined || autoStart != "false" )    
{    
    a.openFrame("meinCRM", null, false, a.FRAMEMODE_EDIT);
}