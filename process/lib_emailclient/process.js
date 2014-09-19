import("lib_mailbridge");

/*
* Syncronisiert die Tabelle AOSYS_MAILCACHE mit dem EMaileserver
* 
* @param {String} pUser req der Aditouser
* @param {String} pPostbox req Name des Postfach
*
* @return {void}
*/

function updateMessages(pUser, pPostbox)
{
    var postbox = getPostbox(pPostbox);
    var server = emails.getMessages( pUser, postbox );
    var cached = a.sql("SELECT MAILID FROM AOSYS_MAILCACHE WHERE MAILUSER = '" + pUser + "' AND POSTBOX = '" + postbox + "'", a.SQL_COLUMN);
    var columns = new Array("MAILUSER", "MAILID", "SUBJECT", "PARTNER", "SENTDATE", "POSTBOX","ATTACHMENTS", "SEEN",  "STORED");  
    var types = a.getColumnTypes( "AOSYS_MAILCACHE", columns);
    var updates = false;
			
    for (i = 0; i < cached.length; i++)
    {
        if (!contains(server, cached[i]))
        {
            // Element aus Cache löschen
            a.sqlDelete("AOSYS_MAILCACHE", " MAILUSER = '" + pUser + "' AND POSTBOX = '" + postbox + "' AND MAILID = '" + cached[i] + "'");
            updates = true;
        }	
    }
	 
    for (i = 0; i < server.length; i++)
    {
        if (!	contains(cached, server[i]))
        {
            // Element in Cache einfügen
            var partner = null;
            var subject = null;			
            try
            {
                var mail = emails.getMessage(pUser, server[i], postbox);			
                subject = mail[emails.MAIL_SUBJECT];
                if (subject == null) subject = "";
                var date = mail[emails.MAIL_SENTDATE];		
                if ( pPostbox == "OUTBOX" )
                {
                    partner = mail[emails.MAIL_RECIPIENT];
                }
                else
                {
                    partner = mail[emails.MAIL_SENDER];
                }
                if (partner == null) partner = "";
                var vals = new Array( pUser, server[i], subject, partner, date, postbox, mail[emails.MAIL_ATTACHMENTCOUNT], 0, 0 );
                a.sqlInsert("AOSYS_MAILCACHE", columns, types, vals);
                updates = true;
            }
            catch (ex)
            {
                //  Mailid noch nicht als Fehler ausgegeben
                var errormailids = a.valueofObj("$global.MailClientErrorMailIDs") ;
                if (!	contains( errormailids, server[i] ) )
                {
                    addErrorMailID( server[i] );
                    a.showMessage(a.translate("Mail konnten nicht in das System übernommen werden.") + "\n" + server[i]  + "\n\n" +  ex.javaException["messageTrace"] );
                    log.show(ex, log.INFO);
                }
                continue;
            }
        }
    }
    // wenn Änderungen dann refresh der Tabellen
    if( updates )
    {
        var refreshids = a.valueofObj("$global.MailClientRefresh");
        a.refresh("$comp.INBOX", refreshids[0], refreshids[1]);
        a.refresh("$comp.OUTBOX", refreshids[0], refreshids[1]);
        a.refresh("$comp.DELBOX", refreshids[0], refreshids[1]);
    }
}
/*
* Hängt FileName an Liste.
*
* @param {String} pMailID req
* 
* @return {void}
*/
function addErrorMailID( pMailID )
{
    var list = a.valueofObj("$global.MailClientErrorMailIDs");
    var nlist = new Array();
    for ( var y = 0; y < list.length; y++ ) nlist.push( list[y] );
    nlist.push( pMailID );
    a.globalvar( "$global.MailClientErrorMailIDs", nlist );
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
        if (pArray	[j] == pElement)
            return true;	
    }

    return false;
}

/*
* gibt das Postfach des Mailserver zurück
*
* @param {String} pPostbox req Name des Postfach
*
* @return {String} Postbox
*/
function getPostbox( pPostbox )
{
    var text = new Array();
    text["INBOX"] = "INBOX";
    text["OUTBOX"] = "Gesendete Objekte";
    text["DELBOX"] = "Gelöschte Objekte";
    return text[ pPostbox ];
}
/*
* speichert Mail des Mailserver im Repository
*
* @param {String} pBox req Name des Postfach
*
* @return {String} Postbox
*/
function storeMessage( pBox )
{
    var user = a.valueof("$comp.user");
    var ids  = a.decodeMS(a.valueof("$comp." + pBox));
    var postbox = getPostbox(pBox);   
    for (i = 0; i < ids.length; i++)
    { 
        var stored = a.sql("SELECT STORED FROM AOSYS_MAILCACHE WHERE MAILUSER = '" + user + "' AND POSTBOX='" + postbox + "' AND MAILID = '" + ids[i] + "'"); 
        if (stored == "0") 
        { 	  	
            var mailid = emails.storeMessage( user, ids[i], postbox ); 
            var mail = emails.getMail( mailid );
            var sender = emails.extractAddress(mail[emails.MAIL_SENDER]);
            var rec = mail[emails.MAIL_RECIPIENT].split(";");
            var recipients = new Array();
            for (var z = 0; z < rec.length; z++)
                recipients.push (emails.extractAddress(rec[z]));
            if ( MailToHistory( sender, recipients, mail ) == "" )
            {
                a.showMessage( a.translate("Mailadresse nicht vorhanden.\nSiehe unverknüpfte Mials!") );
            }
            a.sqlUpdate("AOSYS_MAILCACHE", ["STORED"], [SQLTYPES.INTEGER], [1], "MAILUSER = '" + user 
                + "' AND POSTBOX = '"+ postbox + "' AND MAILID = '" + ids[i] + "'"); 
            a.refresh("$comp.unlinked_mails");
        }  
        else  
        { 	  	
            a.showMessage("Bereits im Repository: " + (i+1)); 
        } 
    }
    a.refresh("$comp." + pBox);
}
/*
* löscht Mail des Mailserver
*
* @param {String} pBox req Name des Postfach
*
* @return {String} Postbox
*/

function deleteMessage( pBox )
{
    var ids = a.decodeMS(a.valueof("$comp." + pBox)); 
    var user = a.valueof("$comp.user");  
    var postbox = getPostbox(pBox);
    if ( a.askQuestion( ids.length + " " + a.translate("E-Mails löschen ?"), a.QUESTION_YESNO, "") == "true" )
    {
        for (i = 0; i < ids.length; i++)
        {
            var result = emails.deleteMessage(user, ids[i], postbox);   
            a.sql("DELETE FROM AOSYS_MAILCACHE WHERE MAILUSER = '" + user + "' AND POSTBOX = '" + postbox + "' AND MAILID = '" + ids[i] + "'"); 
        }
        a.refresh("$comp." + pBox);
    }
}