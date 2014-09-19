import("lib_mailbridge");
import("lib_relation");

var realtionid = a.valueof("$comp.lup_funktion");
var mailid =a.decodeFirst(a.valueof("$comp.unlinked_mails"));
var mail = emails.getMail( "; DB; AO_DATEN; ASYS_MAILREPOSIT; " + mailid + "; ");
// Adresen aufbereiten
var sender = emails.extractAddress(mail[emails.MAIL_SENDER]);
var rec = mail[emails.MAIL_RECIPIENT].split(";");
var recipients = new Array();
for (var i = 0; i < rec.length; i++)
    recipients.push (emails.extractAddress(rec[i]));

if ( realtionid > 0 ) 
{
    var link = new Array( new Array( realtionid, getRelationType(realtionid) ) );
    var subject = mail[emails.MAIL_SUBJECT];
    var text = mail[emails.MAIL_ATTACHMENTCOUNT] + " Attachement(s)\n\n" + "\n\n" + mail[emails.MAIL_TEXT];
    var sentdate = mail[emails.MAIL_SENTDATE];
    mailid = mail[emails.MAIL_ID];
    var medium = "8";  // Email empfangen
    mailid	
    var historyid = newCompleteHistory( a.valueof("$global.user_relationid"), medium, "o", sentdate,
        a.valueof("$sys.user"), mailid, subject, text, link  );
    UnlinkedMail (mailid, ( historyid != "") );
    /*  EMialadresse in Comm eintragen  */
    // alle Emailadressen zur Auswahl
    var addr = recipients;
    addr.push(sender);
    var insertaddr = new Array();
    // meine Emailadressen ausschließen
    var myaddr = a.sql("select ADDR from COMM where RELATION_ID = '" + a.valueof("$global.user_relationid") + "' and MEDIUM_ID in "
        + "( select keyvalue from keyword where keyname2 = 'mail')", a.SQL_COLUMN );
    // Nur einfügen wenn Adresse noch nicht in Adressliste
    for (var z = 0; z < addr.length; z++)  if( !	contains(myaddr, addr[z]) )  insertaddr.push( addr[z] );
    if ( insertaddr.length > 0 )
    {
        var seladdr = a.askQuestion(a.translate("E-Mail-Adresse eintragen ?\n Keine Eintag mit Abbruch !"), a.QUESTION_COMBOBOX, "|" + insertaddr.join("|"))
        if ( seladdr != null )
        {
            medium = 3; // EMail
            var fields = new Array("COMMID", "RELATION_ID", "MEDIUM_ID","ADDR","DATE_NEW","USER_NEW");
            var commvalues = new Array( a.getNewUUID(), realtionid, medium, seladdr,a.valueof("$sys.date"), a.valueof("$sys.user") );
            var types = a.getColumnTypes("COMM", fields );
            a.sqlInsert( "COMM", fields, a.getColumnTypes("COMM", fields), commvalues );		
        }
    }
    a.setValue("$comp.lup_funktion", "");
}
else
{
    MailToHistory( sender, recipients, mail );
}
a.refresh("$comp.unlinked_mails");

/*
* contains
* prüft ob ein Element in einem Array vorhanden ist
*
* @author HB
* @version 1.0
*
* @param {[]} pArray req
* @param {String} pElement req
*
* @return {boolean}
*/
function contains(pArray, pElement)
{
    for (j = 0; j < pArray.length; j++)
    {
        if (pArray	[j] == pElement)
            return true;	
    }

    return false;
}