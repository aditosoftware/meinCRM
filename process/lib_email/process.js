import("lib_addr");
import("lib_util");
import("lib_document");
import("lib_relation");
import("lib_keyword");

/*
* Öffnet das MailProgramm.
*
* @param {String []} pAddresses req die Email-Adresse/n
* @param {String} pRelationID req Relationid
* @param {String} pLanguage opt Sprache
* @param {String} pAddressID opt vom Standard abweichende AddressID
* @param {String} pSubject opt Subject
* @param {[]} pCCAddresses opt CCAdressen
* @param {String} pTemplateName opt
* @param {[]} pAdditionalValues opt
*
* @return {void}
*/
function OpenNewMail( pAddresses, pRelationID, pLanguage, pAddressID, pSubject, pCCAddresses,  pTemplateName, pAdditionalValues  )
{
    var senderid = getSendRelID();
    if (pAdditionalValues == undefined || pAdditionalValues == "") pAdditionalValues = [];
    var mailtext = getTextTemplate( pRelationID, "6", pLanguage, pAddressID, senderid, pTemplateName, pAdditionalValues );
    if ( pCCAddresses == undefined ) 	pCCAddresses = [];
    if ( pSubject == undefined ) 	pSubject = "";
    if( typeof(pAddresses) == "string" )		pAddresses = [pAddresses];
    if( mailtext != "")
    {
        switch (a.valueof("$global.MailClient").toUpperCase())
        {
            //Nimmt ADITO für den Emailversand her
            case "ADITO":
                var senderaddress = a.sql("select ADDR from COMM join KEYWORD on KEYVALUE = MEDIUM_ID where " + getKeyTypeSQL("PersMedium") 
                    + " and KEYNAME2 = 'mail' and RELATION_ID = '" + senderid + "' order by COMM.STANDARD desc");
                openADITONewMail( senderaddress, pAddresses, pCCAddresses, [a.valueof("$global.mailbridge")], pSubject, mailtext );
                break;
            //Nutzt Outlook und generiert in einem VBScript eine neue Mail
            case "OUTLOOK":
                openOutlookNewMail( pAddresses, pCCAddresses, [a.valueof("$global.mailbridge")], pSubject, mailtext );
                break;
            //Generiert eine mailto-URL und ruft diese anschließend auf											
            default:
                openMailToNewMail( pAddresses, pCCAddresses, [a.valueof("$global.mailbridge")], pSubject, mailtext );
        }
    }
}

/*
* Öffnet ein MailProgramm.
*
* @param {String} pRecipient req die Email-Adresse
* @param {String} pCCRecipient req die Email-Adresse
* @param {String} pBCCRecipient req die Email-Adresse
* @param {String} pSubject req die Email-Supject
* @param {String} pText req die Email-Text
*
* @return {void}
*/
function openMailToNewMail(pRecipient, pCCRecipient, pBCCRecipient, pSubject, pText )
{
    var mailtostring = "";

    if(pCCRecipient != "" && pCCRecipient != undefined)
    {
        if(mailtostring != "")
            mailtostring += "&";
        mailtostring += "cc=" + getMailAddresses(pCCRecipient);
    }

    if(pBCCRecipient != "" && pBCCRecipient != undefined)
    {
        if(mailtostring != "")
            mailtostring += "&";
        mailtostring += "bcc=" + getMailAddresses(pBCCRecipient);
    }
	
    if(encodeURIComponent(pSubject) != "" && encodeURIComponent(pSubject) != undefined)
    {
        if(mailtostring != "")
            mailtostring += "&";
        mailtostring +="subject=" + encodeURIComponent(pSubject);			
    }
	
    if(encodeURIComponent(pText) != "" && encodeURIComponent(pText) != undefined)
    {
        if(mailtostring != "")
            mailtostring += "&";
        mailtostring +="body=" + encodeURIComponent(pText);			
    }

    var mail = new Array("mailto:" + getMailAddresses(pRecipient) + "?" + mailtostring);
    a.doClientCommand(a.CLIENTCMD_OPENURL, mail);
}

/*
* Öffnet das ADITOMailProgramm.
*
* @param {String} pSender req die Email-Adresse
* @param {String} pRecipient req die Email-Adresse
* @param {String} pCCRecipient req die Email-Adresse
* @param {String} pBCCRecipient req die Email-Adresse
* @param {String} pSubject req die Email-Supject
* @param {String} pText req die Email-Text
* @param {[]} 	pAttachment opt Array [[FileName, File]]
*
* @return {void}
*/
function openADITONewMail( pSender, pRecipient, pCCRecipient, pBCCRecipient, pSubject, pText, pAttachment )
{
    var mail = emails.newMail();
    var i;
    if ( pSender != "")	emails.setSender(mail, pSender);
    for (i = 0; i < pRecipient.length; i++ )	emails.addRecipients(mail, emails.RECIPIENT_TO , pRecipient[i]);
    for (i = 0; i < pCCRecipient.length; i++ )	emails.addRecipients(mail, emails.RECIPIENT_CC , pCCRecipient[i]);
    for (i = 0; i < pBCCRecipient.length; i++ )	emails.addRecipients(mail, emails.RECIPIENT_BCC , pBCCRecipient[i]);
    emails.setSubject(mail, pSubject);
    var charset = new Configuration().getOption("Base64Charset");
    if ( charset == "" ) 	charset = "ISO-8859-15";
    var type = "text/plain";a.pa
    if ( pText.substr(0, 6) == "<html>" )   type = "text/html";
    emails.addText(mail, pText, type, charset);
    if (pAttachment != undefined )
        for ( i = 0; i < pAttachment.length; i++)
            emails.addBase64Attachment(mail, pAttachment[i][1], a.getMimeType(pAttachment[i][1]), pAttachment[i][0], false);
    emails.editMail(null,mail, false);
}

/*
* Öffnet MS Outlook mit einer neuen Email und ggf. Anhängen.
* 
* @param {String []} pRecipient req die Email-Adresse
* @param {String []} pCCRecipient req die Email-Adresse
* @param {String []} pBCCRecipient req die Email-Adresse
* @param {String} pSubject req die Email-Supject
* @param {String} pText req die Email-Text (entweder HTML oder Plaintext)
* @param {String []} pAttachments opt die Anhänge in Form eines Laufwerkpfades als ein-Dimensionales Array
* 
* @return {Boolean}
*/
function openOutlookNewMail(pRecipient, pCCRecipient, pBCCRecipient, pSubject, pText, pAttachments)
{
    if (pRecipient != "" && pRecipient != undefined)
    {
        var script =   'set MyApp = CreateObject("Outlook.Application") \r\n' 
        + 'set MyItem = MyApp.CreateItem(0) \r\n' 
        + 'with MyItem \r\n';
								 
        if (pRecipient != "" && pRecipient != undefined)		
            script += '		.To = "' + getMailAddresses(pRecipient) + '" \r\n';
 	 		
        if (pCCRecipient != "" && pCCRecipient != undefined)		
            script += '		.Cc = "' + getMailAddresses(pCCRecipient) + '" \r\n';
 	 		 	 		
        if (pBCCRecipient != "" && pBCCRecipient != undefined)		
            script += '		.Bcc = "' + getMailAddresses(pBCCRecipient) + '" \r\n';
 	 		
        if (pSubject != "" && pSubject != undefined) 			
            script += '		.Subject = "' + pSubject + '" \r\n';

        if (pText != "" && pText != undefined)
        {
            if ( pText.substr(0, 6) == "<html>" )		script += '		.HTMLBody = "' +  mwspecialreplace(pText) + '" \r\n';
            else	script += '		.Body = "' + mwspecialreplace(pText) + '" \r\n';
        }
							 
        if (pAttachments != undefined)	
            for (var i = 0; i < pAttachments.length; i++) 	script += '		.Attachments.Add "' + pAttachments[i] + '", olByValue, 1 \r\n';

        script += 'End With \r\n'
        + 'MyItem.Display';
							  
        if (script != "")
        {
            var tempfile =  a.valueof("$sys.clienttemp") + "/" + "run.vbs";
            if ( FileIOwithError( a.CLIENTCMD_STOREDATA, [ tempfile, script, a.DATA_TEXT, false, "UTF-16LE"]) ) return false; 
            if ( FileIOwithError( a.CLIENTCMD_OPENFILE, [tempfile] ) ) return false; 
        }
    }
    return true;
}

/*
* Generiert aus einem Array aus Emailadressen einen Semikolon-getrennten String.
*
* @param {[]} pMailAddresses req die Emailadressen als ein-dimensionales Array
* 
* @return {String} mit den Addressen
*/
function getMailAddresses(pMailAddresses)
{
    var str = "";
	
    //Loop thru all MailAddresses and create an string...
    for (var i = 0; i < pMailAddresses.length; i++)
        str += (str != "" ? "; " : "") + pMailAddresses[i];
		
    return str;
}

/*
* Ersetzt die Platzhalter
* 
* @param {String} pValue req der Wert mit dem ersetzt wird
*
* @return {String}
*/
function mwspecialreplace(pValue)
{
    var str = pValue.replace(/\x22/g, '" & Chr(34) & "');  // Anführungszeichen ersetzen
    str = str.replace( /\r\n/g , '" & vbCR & "');
    str = str.replace( /\n/g , '" & vbCR & "');
    str = str.replace( /\r/g , '" & vbCR & "'); 
    return str;
}

/*
* 
* @param {String} pSubject req
* @param {String} pRelationID req
* @param {String} pTemplate req Name der DokuVorlage
* @param {String} pFile opt Pfad und Filename als Anlage
* @param {String} pDocName opt Name der Dokuvorlage als Anlage
* @param {[]} pCCaddresses opt
* @param {[]} pAdditionalValues opt
* @param {Integer} pLanguage opt
* 
* @return {void}
*/
function sendAutoMail( pSubject, pRelationID, pTemplate, pFile, pDocName, pCCaddresses, pAdditionalValues, pLanguage)
{
    var senderid = getSendRelID();
    var attachment;
    var anlagen;
    var file;
    if ( pLanguage == undefined || pLanguage == "") pLanguage = a.sql("select LANG from RELATION where RELATIONID = '" + pRelationID + "'");
    var mailtext = getTextTemplate( pRelationID, getKeyValue( "E-MailWorkflow", "DokArt" ), pLanguage, undefined, senderid, pTemplate, pAdditionalValues );
    var address = a.sql("select addr from comm where medium_id = 3 and RELATION_ID = '" + pRelationID + "' order by STANDARD desc");	
    if ( pCCaddresses == undefined || pCCaddresses == "") pCCaddresses = [];
    var BCCaddresses = [a.valueof("$global.mailbridge")];
    if (pAdditionalValues == undefined || pAdditionalValues == "") pAdditionalValues = [];
    
    if( mailtext != "")
    {
        switch (a.valueof("$global.MailClient").toUpperCase())
        {
            //Nutzt Outlook und generiert in einem VBScript eine neue Mail
            case "OUTLOOK":
                attachment = [];												
                if (pFile != undefined && pFile != "")	attachment.push(pFile);
                if ( pDocName != undefined && pDocName != "")
                {
                    anlagen = a.sql("select filename, bindata from asys_binaries join document on row_id = documentid where "
                        + " document.aotype = 3 and asys_binaries.tablename = 'DOCUMENT' and NAME = '" + pDocName + "'", a.SQL_COMPLETE);
                    for ( i = 0; i< anlagen.length; i++)
                    {
                        file = a.valueof("$sys.clienttemp") + "/" + anlagen[i][0];
                        a.doClientIntermediate(a.CLIENTCMD_STOREDATA, [ file, anlagen[i][1], a.DATA_BINARY ]);
                        attachment.push(file);
                    }
                }
                openOutlookNewMail(  [address], pCCaddresses, BCCaddresses, pSubject, mailtext, attachment );
                break;
            //Nimmt ADITO für den Emailversand her
            default:	
                var senderaddress = a.sql("select ADDR from COMM join KEYWORD on KEYVALUE = MEDIUM_ID where " + getKeyTypeSQL("PersMedium") 
                    + " and KEYNAME2 = 'mail' and RELATION_ID = '" + senderid + "' order by COMM.STANDARD desc");
                attachment = [];												
                if ( pFile != undefined )  attachment.push( [pFile, a.doClientIntermediate(a.CLIENTCMD_GETDATA, [pFile, a.DATA_BINARY])] );	
                if ( pDocName != undefined )
                {
                    anlagen = a.sql("select filename, bindata from asys_binaries join document on row_id = documentid where "
                        + " document.aotype = 3 and asys_binaries.tablename = 'DOCUMENT' and NAME = '" + pDocName + "'", a.SQL_COMPLETE);
                    for ( i = 0; i< anlagen.length; i++)
                    {
                        file = a.valueof("$sys.clienttemp") + "/" + anlagen[i][0];
                        attachment.push([file, anlagen[i][1]]);
                    }
                }	
                openADITONewMail( senderaddress, [address], pCCaddresses, BCCaddresses, pSubject, mailtext, attachment );
        }
    }
}