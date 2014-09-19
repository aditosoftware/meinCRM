import("lib_history");
import("lib_document");
import("lib_frame");

/*
* Legt zu einer Mail eine History mit Historylinks an.
*
* @param {String} sender req Sender Email Adresse
* @param {[]} recipients req Empfänger Email Adressen
* @param {Object} mail req Mail
* @param {Boolean} attachnmenttohist opt bei true werden die Anlagen in der History gespeichert
*
* @return {void}
*/
function  MailToHistory( sender, recipients, mail, attachnmenttohist )
{
    var subject = mail[emails.MAIL_SUBJECT];
    var text = mail[emails.MAIL_ATTACHMENTCOUNT] + " Attachement(s)\n\n" 
    + mail[emails.MAIL_SUBJECT] + "\n\n" + mail[emails.MAIL_TEXT];
    var sentdate = mail[emails.MAIL_SENTDATE];
    var mailid = mail[emails.MAIL_ID];
    var link = new Array();
    var realtionid = "";
    var historyid = "";
    var RecipientsRelation;
    var rr;
    var SenderRelation = GetRelation(sender);
    if ( attachnmenttohist == undefined ) attachnmenttohist = false;

    if ( SenderRelation.length > 0)
    {
        for(var sr = 0; sr < SenderRelation.length; sr++)
        {
            //   Ist der Sender ein Mitarbeiter ?
            if ( IsEmloyee( SenderRelation[sr][0] ) )   //  Email gesendet 
            {
                direction = "o";
                realtionid = SenderRelation[sr][0];
                for (var i = 0; i < recipients.length; i++)
                {
                    RecipientsRelation = GetRelation( recipients[i] );
                    for(rr = 0; rr < RecipientsRelation.length; rr++)
                    {
                        if ( RecipientsRelation[rr].length > 0 )
                        {
                            link.push( RecipientsRelation[rr] );
                        }
                    }
                }	
            }
            else
            {
                for(var sr1 = 0; sr1 < SenderRelation.length; sr1++)
                {
                    link.push( SenderRelation[sr1] ); 
                }
                direction = "i";
                for (var i1 = 0; i1 < recipients.length; i1++)
                {
                    RecipientsRelation = GetRelation( recipients[i1] );
                    for(rr = 0; rr < RecipientsRelation.length; rr++)
                    {
                        if ( RecipientsRelation[rr][0] != "undefined" )
                        {
                            if ( IsEmloyee( RecipientsRelation[rr][0] ) ) 
                            {
                                realtionid = RecipientsRelation[rr][0];
                            }
                            else
                            {
                                link.push( RecipientsRelation[rr] );
                            }
                        }
                    }
                }
                break;  //Stoppt die for Schleife, damit bei Mitarbeiter ist Empfänger die Sender nicht doppelt in der Historie verknüpft werden.
            }
        }			
        if (link.length > 0 || attachnmenttohist)
        {
            setAdditionalLink( mail, link );						
            historyid = newCompleteHistory( realtionid, "8", direction, sentdate, "MailBridge", mailid, subject, text, link, "AO_DATEN");
            //  Anhänge in die Dukumentenmappe der History
if( historyid != "" && attachnmenttohist ) 
            {  
                mailAttachmentToDoc( mail , "$!GENERIC!$" , "DOCUMENT" , historyid ); 
            }
        }
    }
    UnlinkedMail (mailid, ( historyid != "") )
}
/*
* Legt an oder löscht ein DS in UNLINKEDMAIL.
* 
* @param {String} pMailID req die MailID der Email
* @param {Boolean} linked req true oder false
*
* @return {void}
*/
function UnlinkedMail (pMailID, linked)
{
    var mailid = a.decodeMS(pMailID)[3];
    var isunlinked =  a.sql("select count(*) from UNLINKEDMAIL where MAILID = '" + mailid + "'", "AO_DATEN");
    if ( linked && isunlinked > 0)
    {
        a.sqlDelete("UNLINKEDMAIL", "MAILID = '" + mailid + "'", "AO_DATEN");
    }
    else	if( linked == false && isunlinked == 0)
    {
        a.sql("INSERT INTO UNLINKEDMAIL (MAILID) VALUES ('" + mailid + "')" , "AO_DATEN");
    }
}

/*
* Gibt die RelationID der Emailadresse zurück.
*
* @param {String} pEmailAdress req die Emailadresse
* 
* @return {String} RelationID
*/
function GetRelation(pEmailAdress)
{
    var rel = a.sql("select RELATIONID, case when PERS_ID is null then 1 else case when " + trim("RELATION.ORG_ID") + " = '0' then 2 else 3 end end from RELATION "
        + " join COMM on (RELATION_ID = RELATIONID) where upper(ADDR) = upper('" + pEmailAdress + "')" , a.SQL_COMPLETE);
    return rel;
}

/*
* Gibt an, ob eine RelationID einem Mitarbeiter gehört.
*
* @param {String} pSenderRelationID req eine RelationID
* 
* @return {Boolean} true oder false
*/
function IsEmloyee(pSenderRelationID)
{
    return ( a.sql("select count(*) from EMPLOYEE where RELATION_ID = '" + pSenderRelationID + "'") > 0 );
}

/*
* Trimt den übergebenen Text vorne und hinten.
* 
* @param {String} txt req der zu trimmende Text
* 
* @return {String} der getrimmte Text
*/
function trim(txt) 
{
    return txt.replace(/(^\s+)|(\s+$)/g,"")
}

/*
* setzt weitere Links
* z.B.: mail[emails.MAIL_SUBJECT] = #Reklamation:1234# filtert die 1234 und verknüpft dann zu der entspr. Historie
* config: [[TABLENAME, ID, Subject oder Text, mit/ohne Hochkomma]]
*
* @param {string} pMail req gesamte Email
* @param {[]} pLink req 
*/
function setAdditionalLink( pMail, pLink )
{
    var config = [["COMPLAINT", "COMPLAINTNUMBER", emails.MAIL_SUBJECT, "" ],
    ["SALESPROJECT", "PROJECTNUMBER", emails.MAIL_TEXT, ""]];
    
    var fd = new FrameData();
    for ( var i = 0; i < config.length; i++ )
    {
        var fddata = fd.getData("name", config[i][0], ["title", "table", "idcolumn", "id"]);
        var anf = pMail[config[i][2]].indexOf("#" + fddata[0][0] + ":");
        
        if ( anf != -1 )
        {
            anf = anf + fddata[0][0].length + 2;
            var ende = pMail[config[i][2]].indexOf("#", anf);
            if ( ende != -1 )
            {
                var number = pMail[config[i][2]].substring( anf, ende );
                try
                {
                    var id = a.sql("select " + fddata[0][2] + " from " +  config[i][0] + " where " +  config[i][1] + " = " + config[i][3] + number + config[i][3]);
                    pLink.push( [ id, fddata[0][3]] ); 
                }		
                catch(err)
                {
                    log.log("ERROR Tablle " +  config[i][0] + "nicht gefunden !", log.WARNING);
                }
            }
        }
    }
}

/*
* prüft ob ein Element in einem Array vorhanden ist
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
        if (pArray[j].toUpperCase() == pElement.toUpperCase())
            return true;	
    }

    return false;
}


/*
 * Erzeugt Historien für übergebene E-Mails
 * 
 * @param {Object} pEmail req Das Mailobjekt.
 * 
 * @return {void}
 */

function Email2History( pEmail )
{       
    var info = "Sender: " + pEmail[emails.MAIL_SENDER] + "\nEmpfänger: " + pEmail[emails.MAIL_RECIPIENT];
    if ( pEmail[emails.MAIL_ATTACHMENTCOUNT] > 0 )  info += "\n" + pEmail[emails.MAIL_ATTACHMENTCOUNT] + " Anhänge";
    info += "\n\n" + pEmail[emails.MAIL_TEXT];
    var relids = [];
    var direction = "i";
    var sender = pEmail[emails.MAIL_SENDER];
    var rec = pEmail[emails.MAIL_RECIPIENT].split(";");
    // alle Emailadressen zur Auswahl
    var recipients = new Array();
    for (var i = 0; i < rec.length; i++)
        if (rec[i] != "") recipients.push (emails.extractAddress(rec[i]));

    if ( sender != "" ) 
    {
        sender =  GetRelation( emails.extractAddress(sender) );
        if ( sender.length > 0 )
        {
            if ( IsEmloyee( sender[0][0] ) )  direction = "o"; 
            else relids.push( sender[0][0] ); 
        }
    }

    for ( i = 0; i < recipients.length; i++)
    {
        var RecipientsRelation = GetRelation( recipients );
        for(var rr = 0; rr < RecipientsRelation.length; rr++)
        {
            if ( RecipientsRelation[rr][0] != "undefined" )
            {
                if ( !IsEmloyee( RecipientsRelation[rr][0] ) ) 
                {
                    relids.push( RecipientsRelation[rr][0] );
                }
            }
        }
    }
    var files = [];
    var infos = emails.getAttachmentInfos(pEmail)
    for ( i = 0; i < infos.length; i++)
    {
        var filename = a.decodeFirst(infos[i]);
        var attachment = emails.getAttachment(pEmail, i);
        if ( !( filename.search(/\.(png|gif|jpg|bmp)$/i) > -1 &&  attachment < 10000  ) )    
            files.push([ filename, attachment ]);
    }
    if ( files.length > 0 && a.askQuestion(a.translate("Betreff: " + pEmail[emails.MAIL_SUBJECT] + "\nAnhänge übernehmen?"), a.QUESTION_YESNO, "") == "false")   files = [];

    InsertHistory( relids, "E-Mail", direction, pEmail[emails.MAIL_SUBJECT], info,[] , files );
}