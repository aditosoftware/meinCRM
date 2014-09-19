import("lib_history");
import("lib_addr");
import("lib_util");
import("lib_keyword");
import("lib_frame");

/*
* Liefert die Emailadresse für Kampagnen und Mailings einer Relation.
* 
* @param {String} pRelation req die RELATIONID
* 
* @return {String} Emailadresse als String oder leer/null
*/
function getMailingAddress(pRelation)
{
    // haben wir eine spezielle mailing-adresse?
    var sql = " select addr from comm "
    + " where medium_id in (select keyvalue from keyword where keyname2 = 'mail' ) "
    + " and addr like '%@%' and relation_id = '" + pRelation + "' order by COMM.STANDARD desc ";
    return a.sql(sql);
}

/*
* löscht Empfänger .
*
* @param {String} pTableName req Tabellenname der Condition
* @param {String} pCondition req Condition
* @param {String} pBulkmailID opt die ID der Serienmail wenn undefined dann mit Aúswahldialog 
*
* @return {integer} Anzahl der gelöschten Addressen
*/
function deleteRecipientsWithCondition( pTableName, pCondition, pBulkmailID )
{
    if ( pBulkmailID == undefined ) pBulkmailID = chooseBulkMail();
    if ( pBulkmailID != "" )
    {
        var sqlstr = "select BULKMAILRCPTID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID"
        + " join BULKMAILRCPT on RELATIONID = BULKMAILRCPT.RELATION_ID and BULKMAILDEF_ID = '" + pBulkmailID + "' ";
        switch( pTableName )
        {
            case "PERS":
                sqlstr += " join PERS on RELATION.PERS_ID = PERS.PERSID ";
                break;
            case "ORG":				
                sqlstr += " join ORG on RELATION.ORG_ID = ORG.ORGID ";
                break;
            case "DISTLIST":			
                sqlstr += " join DISTLISTMEMBER on DISTLISTMEMBER.RELATION_ID = RELATIONID ";
                break;
        }
        sqlstr += " where "	+ pCondition;
        var relids = a.sql( sqlstr, a.SQL_COLUMN );
        if ( relids.length > 0)
        {
            if ( a.askQuestion( relids.length + " " + a.translate("Empfänger entfernen") + "?", a.QUESTION_YESNO, "") == "true")
            {
                return a.sqlDelete("BULKMAILRCPT", "BULKMAILRCPTID in (" + sqlstr + ")");
            }
        }
        else a.showMessage( a.translate("Kein Empfänger zum entfernen"));
    }
    return 0;
}

/*
* Fügt Empfänger zu der Serienmail hinzu.
*
* @param {String} pTableName req Name der Tabelle
* @param {String} pCondition req eine Condition
* @param {String} pBulkmailID req die ID der Serienmail 
*
* @return {Boolean} true, wenn Empfänger hinzugefügt werden
*/
function addRecipientsWithCondition( pTableName, pCondition, pBulkmailID )
{
    if ( pBulkmailID == undefined ) pBulkmailID = chooseBulkMail();
    res = false;
    if ( pBulkmailID != "" )
    {
        var recipients = getRecipients( pTableName, pCondition, pBulkmailID )
        if ( recipients.length > 0 )
        {
            if (a.askQuestion(recipients.length + " " + a.translate("Empfänger hinzufügen") + "?", a.QUESTION_YESNO, "") == "true")
            {
                var countofnoemailadrr =  addRecipients( recipients, pBulkmailID );
                if ( countofnoemailadrr > 0 )	a.showMessage( countofnoemailadrr + "  " + a.translate(" E-Mail-Adressen nicht gefunden"));
                res = true;
            }
        }		
        else a.showMessage( a.translate("Kein Empfänger zum hinzufügen"));
    }
    return res;
}

/*
* liefert Empfänger und EMailaddr zurück.
*
* @param {String} pTableName req Tabellenname der Condition
* @param {String} pCondition req Condition
* @param {String} pBulkmailID opt die ID der Serienmail wenn undefined dann mit Aúswahldialog 
*
* @return {[] integer} Anzahl [eingetragen, bereits eingetragen, keine Email vorhanden]
*/
function getRecipients( pTableName, pCondition, pBulkmailID )
{
    var con = "";
    var sql = "select RELATIONID, COMM.ADDR from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID ";
    switch( pTableName )
    {
        case "PERS":
            sql += " join PERS on (RELATION.PERS_ID = PERS.PERSID and RELATION.STATUS = 1) ";
            break;
        case "ORG":				
            sql += " join ORG on (RELATION.ORG_ID = ORG.ORGID and RELATION.PERS_ID is null and RELATION.STATUS = 1) ";
            break;
        case "DISTLIST":			
            sql += " join DISTLISTMEMBER on (DISTLISTMEMBER.RELATION_ID = RELATIONID and RELATION.STATUS = 1) ";
            break;
    }
    var keyvalue = a.sql("select distinct keyvalue from keyword where keyname2 = 'mail'", a.SQL_COLUMN);
    sql += " left join COMM on (RELATIONID = COMM.RELATION_ID and addr like '%@%' and medium_id in (" + keyvalue.join(",") + "))"
    + " where " + pCondition + " and RELATIONID NOT IN (SELECT RELATION_ID FROM bulkmailrcpt WHERE bulkmaildef_id = '" + pBulkmailID + "')"
    + " order by RELATIONID, COMM.STANDARD desc ";
    return a.sql( sql, a.SQL_COMPLETE );
}

/*
* Wählt eine Serienmail aus.
* 
* @return Id der Serienmail 
*/
function chooseBulkMail()
{
    var pBulkmailID = "";
    var antwort = a.askUserQuestion(a.translate("Bitte wählen Sie eine Serienmail !"), "DLG_CHOOSE_BULKMAIL");
    if (antwort != null)
    {
        var selection = antwort["DLG_CHOOSE_BULKMAIL.selection"];
        pBulkmailID = a.decodeFirst(selection);
    }
    return pBulkmailID;
}

/*
* Fügt Empfänger zu der Serienmail hinzu.
*
* @param {String []} pRecipients req die [RELATIONID, Mailadress]
* @param {String} pBulkmailID req die ID der Serienmail 
*
* @return {integer} Anzahl keine Email vorhanden
*/
function addRecipients( pRecipients, pBulkmailID )
{
    var res = 0;
    if ( pBulkmailID == undefined ) pBulkmailID = chooseBulkMail();
    if ( pBulkmailID != "" )
    {
        var spalten = new Array("BULKMAILRCPTID", "RELATION_ID", "USER_NEW", "DATE_NEW", "BULKMAILDEF_ID", "EMAILUSED");
        var typen = a.getColumnTypes("BULKMAILRCPT", spalten);
        var actdate = a.valueof("$sys.date");
        var user = a.valueof("$sys.user");
        var lastrelid = "";
        for ( var i = 0; i < pRecipients.length; i++ )	
        {
            if (lastrelid != pRecipients[i][0])
            {
                var werte = [ a.getNewUUID(), pRecipients[i][0] , user, actdate, pBulkmailID, pRecipients[i][1] ];
                a.sqlInsert("BULKMAILRCPT", spalten, typen, werte);		
                if(werte[5] == "" || werte[5] == undefined)		res++; // keine email gefunden
            }
            lastrelid = pRecipients[i][0];
        }
    }
    return res;
}

/*
* Sendet ein komplettes Mailing ohne Nachfrage.
* 
* @param {String} pMailing req ID des Mailings
* @param {Boolean} pWriteHistory req true oder false, ob Historie geschrieben werden soll
* 
* @return {void}
*/
function sendMailing(pMailing, pWriteHistory)
{
    var rcptlist = buildRcptList(pMailing, "ALL");
    lockMailing(pMailing, true);
    processMailingRecords(pMailing, rcptlist, pWriteHistory);
}


/*
* Setzt den Lockstatus eines Mailings.
* 
* @param {String} pMailing req ID des Mailings
* @param {Boolean} pLocked req true oder false
*
* @return {void}
*/
function lockMailing(pMailing, pLocked)
{
    var spalten = new Array();
    spalten[0] = "SENTDATE";
    var typen = a.getColumnTypes(a.getCurrentAlias(), "BULKMAILDEF", spalten);
    var werte = new Array(); 
    if(pLocked.toString() == "true")
    {
        werte[0] = a.valueof("$sys.date");
    }
    else
    {
        werte[0] = "";
    }	
    // jetzt das sendedatum fuer dieses mailing setzen
    a.sqlUpdate("BULKMAILDEF", spalten, typen, werte, "BULKMAILDEFID = '" + pMailing + "'");
}


/*
* Liefert die Liste der Mailingempfaenger zurück.
*	
* @param {String} pMailing req die ID des Mailings (BULKMAILDEF.BULKMAILDEFID)
* @param {[]} pSendMode req ALL|ERROR|UNDELIVERED|SELECTION
*
* @return {String []} aus je einem Array aus RELATIONS_ID, EMAILUSED
*/
function buildRcptList(pMailing, pSendMode)
{
    var sqlstr = "select RELATION_ID, EMAILUSED from BULKMAILRCPT join RELATION on RELATION_ID = RELATIONID ";
    var condition = getCommRestrictionCondition( "BULKMAILDEF_ID = '" + pMailing + "'", 2 ); // 2 = kein Serien-Email 
    switch(pSendMode)
    {
        case "1" : //ALL
            break;
        case "3" : //ERR
            condition += " and lastresult = 'ERR'"; 
            break;
        case "2" : //UND
            condition += " and ( lastresult = 'UND' OR lastresult is null )";
            break;
        case "4" : //SEL
            var selection = a.decodeMS(a.valueof("$comp.tblRcpt"));
            condition += " and BULKMAILRCPTID in ('" + selection.join("','") + "')";
            break;
    }
    return a.sql( sqlstr + " where " + condition , a.SQL_COMPLETE );
}


/*
* Liefert den Dateinamen des Anhangs, der für den Mailtext eines Mailings verwendet werden soll.
*
* @param {String} pMailing req ID des Mailings
*
* @return {String} mit dem Dateinamen
*/
function checkMailTextFile(pMailing)
{
    //check attachment list
    var mailfile = "";
	
    var sql = " select filename "
    +	" from asys_binaries "
    +	" where containername = 'BULKMAILATTACHMENT' "
    +	" and row_id = '" + pMailing + "'";
    var alist = a.sql(sql, a.SQL_COLUMN);
	
    if(alist.length > 0)
    {
        var attachlist = makeExArray(alist);

        if(attachlist.indexOf("mailtext.txt") == -1)
        {
            if(attachlist.indexOf("mailtext.html") == -1)
            {
                // nachfragen
                mailfile = a.askQuestion(a.translate("Welche Datei für den Text verwenden?"), a.QUESTION_COMBOBOX, "|" + attachlist.join("|"));
            }
            else
            {
                mailfile = "mailtext.html";
            }
        }
        else
        {
            mailfile = "mailtext.txt";
        }
    }
		
    return mailfile;
}


/*
* Verarbeitet die einzelnen Empfänger eines Mailings.
*
* @param {String} pMailing req ID des Mailings
* @param {[]} pRelations req Array()() mit den Relationen(0) und Emailadressen(1)
* @param {Boolean} pWriteHistory req true oder false, je nachdem, ob eine Historie geschrieben werden soll
*
* @return {void}
*/
function processMailingRecords(pMailing, pRelations, pWriteHistory)
{
    var i;
    var subject = "";          // the subject line for the mail 
    var mail = "";             // the message
    var recpipient = "";       // the recipient of the message
    var sender = "";           // the sender of the message
    var result = 0;            // result code of send action
    var errcount = 0;          // number of errors in mail list
    var reccount = 0;          // number of mail list entries
    var tempname = "";         // name of the template
    var attachlist = null;     // array of attachments

    var individual;
    var mailtext;
    var mailfile;
    var tmpSubject;
    var tmpMailtext;

    var mailTextFile = checkMailTextFile(pMailing);
    var orgMailtext;
    var orgSender;
    var orgSubject;
	
    if(mailTextFile != "")
    {
        // absender, betreff und personalisierungskennzeichen holen
        var data = a.sql("select sender, subject, createindividual from bulkmaildef where bulkmaildefid = '" + pMailing + "'", a.SQL_ROW);
        orgSender = data[0];
        orgSubject = data[1];
        individual = data[2];
		
        // RelationsIds die versendet werden konnten
        var sendrelationids = new Array();
		
        // anzahl der empfaenger festhalten
        reccount = pRelations.length;
	
        // den originalen mailtext holen
        orgMailtext = a.sql("Select BINDATA from ASYS_BINARIES where CONTAINERNAME = 'BULKMAILATTACHMENT' "
            + " and ROW_ID = '" + pMailing + "' and filename = '" +  mailTextFile + "'");
        orgMailtext = decode64(orgMailtext);
		
        // liste der attachments feststellen
        var sql = " select filename "
        +	" from asys_binaries "
        +	" where containername = 'BULKMAILATTACHMENT' "
        +	" and row_id = '" + pMailing + "'";
        attachlist = a.sql(sql, a.SQL_COLUMN);

        var attachmentcount = 0;
        if(attachlist != "")
        {
            attachmentcount = Number(attachlist.length);
        }
		
        // name des mailings fuer die historie
        var mailingname = a.sql("select mailingname from bulkmaildef where bulkmaildefid = '" + pMailing + "'");

        // das hier brauchen wir unten fuer das eintragen  des versendeergebnisses
        var spalten = new Array("USER_EDIT", "DATE_EDIT", "LASTRESULT", "SENTDATE");			
        var typen = a.getColumnTypes(a.getCurrentAlias(), "BULKMAILRCPT", spalten);

        // jetzt alle empfaenger abarbeiten
        // process each mail recipient
        for(var index = 0; index < pRelations.length; index++)
        {
            sender = orgSender;
            subject = orgSubject;
            mailtext = orgMailtext;
            recipient = pRelations[index][1];
			
            // falls keine email fuer diesen empfaenger, 
            // dann zurueck damit
            if((recipient == undefined) || (recipient == ""))
            {
                recipient = sender;
                subject = a.translate("Ruecklaeufer aufgrund fehlender E-Mail-Adresse!");
            }
	
            try  // better safe than sorry
            {
                if (individual == "Y") 
                {
                    // Austausch der Platzhalter
                    // Configuration für die Platzhalter
                    var config = a.sql("select KEYNAME1, KEYNAME2, KEYDETAIL from KEYWORD where " + getKeyTypeSQL("EXPORTFIELDS"), a.SQL_COMPLETE);
                    var addrdata = getAddressesData( [ pRelations[index][0] ], config ); 
                    for (i = 0; i < addrdata[0].length; i++)	subject = subject.replace( new RegExp( "@@" + addrdata[0][i], "ig"), addrdata[1][i] );
                    for (i = 0; i < addrdata[0].length; i++)	mailtext = mailtext.replace( new RegExp( "@@" + addrdata[0][i], "ig"), addrdata[1][i] );
                }
				
                var sentdate = a.valueof("$sys.date");
                result = "???"; // noch nicht gesendet

                // basisdaten der email fuellen
                mail = emails.newMail();
                emails.setSender(mail, sender);
                emails.addRecipients(mail, emails.RECIPIENT_TO, recipient);
                emails.setSubject(mail, subject);
                emails.addText(mail, mailtext, a.getMimeType(mailTextFile), "ISO-8859-1");
				
                // haben wir irgendwelche anhänge ausser dem mailtext?
                if(attachmentcount > 0)
                {
                    for(var j = 0; j < attachlist.length; j++)
                    {
                        var filename = a.sql("Select FILENAME from ASYS_BINARIES where CONTAINERNAME = 'BULKMAILATTACHMENT' AND FILENAME = '" 
                            + attachlist[j] + "' AND ROW_ID = '" + pMailing + "'");
                        if(filename != mailTextFile)
                        {
                            result = a.sql("Select BINDATA from ASYS_BINARIES where CONTAINERNAME = 'BULKMAILATTACHMENT' AND FILENAME = '" 
                                + attachlist[j] + "' AND ROW_ID = '" + pMailing + "'");
                            emails.addBase64Attachment(mail, result, a.getMimeType(result), filename, false);
                        }
                    }
                }
		   	   
                // und weg damit!
                emails.sendMail("mailbridge", mail);
				
                // bis hierher hat alles geklappt
                result = "OK";
            }  
            catch(ex)
            {
                log.log(ex)
                errcount++;   // fehlerzaehler hochzaehlen
                result = "ERR";  // problem melden
            }
			
            // jetzt in die liste der versendeten relationen eintragen
            if (result == "OK")	sendrelationids.push(pRelations[index][0]);
            // jetzt das ergebnis eintragen
            var werte = new Array("SYSTEM", sentdate, result, sentdate);
            a.sqlUpdate("BULKMAILRCPT", spalten, typen, werte, "BULKMAILDEF_ID = '" + pMailing + "' AND RELATION_ID = '" + pRelations[index][0] + "'");			
        }
		
        if (pWriteHistory && sendrelationids.length > 0)
        {
            
            var histDoks = [];
            
            var att = a.sql("Select FILENAME, BINDATA from ASYS_BINARIES where CONTAINERNAME = 'BULKMAILATTACHMENT' and ROW_ID = '" + pMailing + "'", a.SQL_COMPLETE);		
            for (i = 0; i < att.length; i++) 
            {
                var pfad = a.valueof("$sys.clienttemp") + "/" + att[i][0];
                histDoks.push(pfad);
                
                a.doClientIntermediate(a.CLIENTCMD_STOREDATA, [pfad, att[i][1], a.DATA_BINARY ]);
            }
            // HISTORY- und HISTORYLINK-Eintrag erzeugen
            var fd = new FrameData();
            // add to contact history
            var link = [[pMailing, fd.getData("name", "BULKMAIL_DEFINITION", ["id"])[0][0]]];
            InsertHistory( sendrelationids, "Serienmail", "o", a.translate("Serienmail '%0' versandt",  [mailingname]), "", link, histDoks );
        }
    }	
}
/*****************************************************************************/	
Array.prototype.indexOf = function(pElement)
{
    var found = false;
    var i = 0;
    if(this.length >= 0)
    {
        while(!found && (i < this.length))
        {
            found = (this[i].toString() == pElement.toString());
            if(!found) i++;			
        }
    }
    if(found) return i; else return -1;
}
	
/*****************************************************************************/	
/*
* unbekannt
*
* @param {Integer} pArr req
*
* @return {void}
*/
function makeExArray(pArr)
{	
    var attachlist = new Array();
    for(var i = 0; i < pArr.length; i++) attachlist.push(pArr[i]);

    attachlist.indexOf = function(pElement)
    {
        var found = false;
        var i = 0;
        if(this.length >= 0)
        {
            while(!found && (i < this.length))
            {
                found = (this[i].toString() == pElement.toString());
                if(!found) i++;			
            }
        }
        if(found) return i; else return -1;
    }
    return attachlist;		
}
// ende