import("lib_mailbridge");
import("lib_relation");
import("lib_sql");

var relationid = a.valueof("$comp.lup_funktion");
var mailid =a.decodeFirst(a.valueof("$comp.unlinked_mails"));
var mail = emails.getMail( "; DB; AO_DATEN; ASYS_MAILREPOSITORY; " + mailid + "; ");
// meine Emailadressen 
var myaddr = a.sql("select ADDR from COMM where RELATION_ID = '" + a.valueof("$global.user_relationid") + "' and MEDIUM_ID in "
    + "( select keyvalue from keyword where keyname2 = 'mail')", a.SQL_COLUMN );
// Adressen aufbereiten
var sender = mail[emails.MAIL_SENDER] != "" ? emails.extractAddress(mail[emails.MAIL_SENDER]) : myaddr;
var rec = mail[emails.MAIL_RECIPIENT].split(";");
// alle Emailadressen zur Auswahl
var recipients = new Array();
for (var i = 0; i < rec.length; i++)
    if (rec[i] != "")		recipients.push (emails.extractAddress(rec[i]));

var addr = recipients;
addr.push(sender);
if ( relationid != "" ) 
{
    var insertaddr = new Array();
    // Nur einfügen wenn Adresse noch nicht in Adressliste
    for (var z = 0; z < addr.length; z++)  if( !contains(myaddr, addr[z]) )  insertaddr.push( addr[z] );

    var link = new Array( new Array( relationid, getRelationType(relationid) ) );
    var subject = mail[emails.MAIL_SUBJECT];
    var text = mail[emails.MAIL_ATTACHMENTCOUNT] + " Attachement(s)\n\n" + "\n\n" + mail[emails.MAIL_TEXT];
    var sentdate = mail[emails.MAIL_SENTDATE];
    mailid = mail[emails.MAIL_ID];
    var medium = "8";  // Email empfangen
    var historyid = newCompleteHistory( a.valueof("$global.user_relationid"), medium, "o", sentdate,
        a.valueof("$sys.user"), mailid, subject, text, link );
    if ( insertaddr.length > 0 )
    {
        // Emailadresse der Mail bei der Kontaktperson eintragen ?
        var seladdr = a.askQuestion(a.translate("E-Mail-Adresse eintragen ?\nKein Eintrag mit Abbruch !"), a.QUESTION_COMBOBOX, "|" + insertaddr.join("|"))
        if ( seladdr != "" && seladdr != null)
        {
            medium = 3; // EMail
            var fields = new Array("COMMID", "RELATION_ID", "MEDIUM_ID","ADDR","DATE_NEW","USER_NEW");
            var commvalues = new Array( a.getNewID("COMM", "COMMID"), relationid, medium, seladdr,a.valueof("$sys.date"), a.valueof("$sys.user") );
            var types = a.getColumnTypes("COMM", fields );
            if ( isDuplicat("COMM", fields, types, commvalues ) == 0 )   a.sqlInsert( "COMM", fields, types, commvalues );	
        }		
    }
    UnlinkedMail (mailid, ( historyid != "") );
    a.setValue("$comp.lup_funktion", "");
    
}
else MailToHistory( sender, recipients, mail );
a.refresh("$comp.unlinked_mails");