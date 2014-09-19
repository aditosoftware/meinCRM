import("lib_attr");
import("lib_keyword");
import("lib_calendar");
import("lib_email");
import("lib_frame");

// Email-Workflow: Mailbridge eingeschaltet??
var frage;
var email = a.valueof("$comp.EMAIL");
var complaintnumber = a.valueof("$comp.COMPLAINTNUMBER");
var status = getKeyName(a.valueof("$comp.STATUS"), "COMPLAINTSTATUS")
var fd = new FrameData();
fd = fd.getData("name", ["COMPLAINT"], ["title", "table", "idcolumn", "id"])[0][0];

if (a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW && email != '')
{	
    frage = a.askQuestion(a.translate("E-Mail an Kunden senden?"), a.QUESTION_YESNO, "")
    if (frage == "true")
        sendAutoMail(  "#" + fd + ":" + complaintnumber + "#", a.valueof("$comp.RELATION_ID"), "Email_Reklamation", "", "", "",
            [["TicketCode", complaintnumber], ["TicketStatus", status]])
}
if (a.valueof("$comp.Edit_StatusStart") != a.valueof("$comp.STATUS") && a.valueof("$sys.workingmode") != a.FRAMEMODE_NEW && email != '')
{
    frage = a.askQuestion(a.translate("E-Mail an Kunden senden?"), a.QUESTION_YESNO, "");
    if (frage == "true")	
        sendAutoMail(  "#" + fd + ":" + complaintnumber + "#", a.valueof("$comp.RELATION_ID"), "Email_Reklamation", "", "", "",
            [["TicketCode", complaintnumber], ["TicketStatus", status]])
}

//Prüfen, da sonst Reklamations-Nummer mehrfach vergeben wird.
var maxval = eMath.addInt(a.sql("select max(COMPLAINTNUMBER) from COMPLAINT "),"1");
if(maxval > complaintnumber)  a.setValue("$comp.COMPLAINTNUMBER", maxval);

// min und max Attribute überprüfen
a.rs ( checkAttrCount() );