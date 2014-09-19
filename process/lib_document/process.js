import("lib_keyword");
import("lib_grant");
import("lib_frame");
import("lib_addr");
import("lib_util");

/*
* Öffnet ein Dokument.
*
* @author HB
* @version 1.0
*
* @param {String} pTableName req Name der verknüpften Tabelle
* @param {String} pContainerName req 
* @param {String} pRowID req ID des verknüpften Datensatzes
*
* @return {void}
*/
function openDocument( pTableName, pContainerName, pRowID)
{
    var path = a.valueof("$sys.clienttemp");
    if (pRowID != "")
    {
        var erg = a.sql("SELECT FILENAME, BINDATA, KEYWORD FROM ASYS_BINARIES WHERE TABLENAME = '" + pTableName
            + "' AND CONTAINERNAME = '" + pContainerName + "' AND ROW_ID = '" + pRowID + "'", a.SQL_COMPLETE);
        for ( var i = 0; i < erg.length; i++ )
        {
            var datei = erg[i][0];
            // SerienbriefControlfile ist mit kompletten Pfad eingetragen
            if ( erg[i][2] != "SLControlFile" )	datei = path + "/" + datei;
            var details = new Array(datei, erg[i][1], a.DATA_BINARY); 
            a.doClientIntermediate(a.CLIENTCMD_STOREDATA, details);
            // Wenn SerienbriefControlfile dann nur Speichern
            if ( erg[i][2] != "SLControlFile" )	a.doClientCommand(a.CLIENTCMD_OPENFILE, details);
        }
    }
}

/*
* Gibt die Anzahl der Dokumente zurück.
*
* @author HB
* @version 1.0
*
* @param {String} pTableName req Name der verknüpften Tabelle
* @param {String} pContainerName req 
* @param {String} pRowID req ID des verknüpften Datensatzes
*
* @return {Integer} count
*/
function countDocument( pTableName, pContainerName, pRowID)
{
    var count = 0;
    if (pRowID != "")
    {
        count = a.sql("SELECT count(*) FROM ASYS_BINARIES WHERE TABLENAME = '" + pTableName
            + "' AND CONTAINERNAME = '" + pContainerName + "' AND ROW_ID = '" + pRowID + "'");
    }
    return count;
}

/*
* Speichert ein Dokument.
*
* @author HB
* @version 1.0
*
* @param {String} pTableName req Name der verknüpften Tabelle
* @param {String} pContainerName req Name des Kontainers
* @param {String} pRowID req ID des verknüpften Datensatzes
* @param {String} pFile req Pfad zu der Datei oder Base64 Daten
* @param {String} pName req Name des Dokuments
* @param {String} pKeyWord opt Schlüsselwort
* @param {String} pDescription opt Beschreibung des Dokuments
*
* @return {void}
*/
function addDocument( pTableName, pContainerName, pRowID, pFile, pName, pKeyWord, pDescription )
{
    //Eintrag der Datei in die Tabelle ASYS_BINARIES verknüpft
    var date = a.valueof("$sys.date");
    var user = a.valueof("$sys.user");
    var fields = ["ID","BINDATA","DATE_EDIT","DATE_NEW","USER_NEW","CONTAINERNAME","TABLENAME","FILENAME","ROW_ID","KEYWORD","DESCRIPTION"];
    var types = a.getColumnTypes( "ASYS_BINARIES", fields);
    var binaryID = a.getNewUUID();
    if ( pKeyWord == undefined ) pKeyWord = "";
    if ( pDescription == undefined ) pDescription = ""; 
    // FileName not Base64 
    if ( pFile.length < 500 )  pFile = a.doClientIntermediate(a.CLIENTCMD_GETDATA, [pFile, a.DATA_BINARY]);
    var value = [ binaryID, pFile, date, date, user, pContainerName, pTableName, pName, pRowID, pKeyWord, pDescription ];
    a.sqlInsert("ASYS_BINARIES", fields, types, value);
}
/*
* Kopiert die Anhänge eines Mailing innerhalb der ASYS_BINARIES.
*
* @author HB
* @version 1.0
*
* @param {String} pContainerName req 
* @param {String} pFromRowID req ID des verknüpften Datensatzes
* @param {String} pToRowID req ID des verknüpften Datensatzes
*
* @return {integer} Anzahl kopierter Dokumente
*/
function copyAttachments( pContainerName, pFromRowID, pToRowID)
{
    var spalten = new Array("ID", "BINDATA", "CONTAINERNAME", "DESCRIPTION", "FILENAME", "KEYWORD", "ROW_ID", "TABLENAME", "USER_NEW", "DATE_NEW");
    var sql = " select " + spalten + " from asys_binaries where (containername = '" + pContainerName + "') and row_id = '" + pFromRowID + "'";
    var liste = a.sql(sql, a.SQL_COMPLETE);
    var typen = a.getColumnTypes("ASYS_BINARIES", spalten);
    var user = a.valueof("$sys.user");
    var sysdate = a.valueof("$sys.date");

    // die komplette liste der attachments umkopieren
    for(var i = 0; i < liste.length; i++)
    {
        var werte =  liste[i];
        werte[0] = a.getNewUUID();
        werte[6] = pToRowID;
        werte[8] = user;
        werte[9] = sysdate;
        a.sqlInsert( "ASYS_BINARIES", spalten, typen, werte );
    }	
}
/*
* Öffnet ein Dokument der History.
*
* @author HB
* @version 1.0
*
* @param {String} pRowID req ID des verknüpften Datensatzes
*
* @return {void}
*/
function openHistoryDocument( pRowID )
{
    openDocument( "$!GENERIC!$", "DOCUMENT", pRowID)
}

/*
* Gibt die Anzahl Dokumente aus der History zurück.
*
* @author HB
* @version 1.0
* 
* @param {String} pRowID req ID des verknüpften Datensatzes
* 
* @return {Integer} count
*/
function countHistoryDocument( pRowID )
{
    return countDocument( "$!GENERIC!$", "DOCUMENT", pRowID)
}

/*
* Speichert für eine History ein Dokument.
* 
* @author HB
* @version 1.0
*
* @param {String} pRowID req ID des verknüpften Datensatzes
* @param {String} pFile req Pfad zu der Datei
* @param {String} pKeyWord req Schlüsselwort
* @param {String} pDescription req Beschreibung des Dokuments
*
* @return {void}
*/
function addHistoryDocument( pRowID, pFile, pKeyWord, pDescription )
{
    if ( typeof(pFile) == "string" )  // FileName
        addDocument( "$!GENERIC!$", "DOCUMENT", pRowID, pFile, fileIO.getName(pFile), pKeyWord, pDescription );
    else   // Base64 Daten
        addDocument( "$!GENERIC!$", "DOCUMENT", pRowID, pFile[1], pFile[0], pKeyWord, pDescription );
}

/*
* Liefert ausgewählte DocumentID zurück
*
* @author HB 
* @version 1.0
*
* @param {String} pType req DocumentenType
* @param {String} pLanguage opt Sprache
* @param {String} pTemplateName opt Name der Vorlage
* 
* @return {String} DocumentID
*/
function chooseTemplate( pType, pLanguage, pTemplateName )
{
    var langcondition = "";
    var templatelist;
    var condition = "AOTYPE = " + pType;
    if ( pLanguage != undefined && pLanguage != "" ) 
    {
        langcondition = " and LANG = " + pLanguage;	
    }
    if ( pTemplateName != undefined && pTemplateName != "" ) 
    {
        condition += " and NAME like '" + pTemplateName + "%'";	
    }
    // die zum Frame gehörigen und die Vorlagen ohne Zugehörigkeit anzuzeigen
    if ( a.hasvar("$image.FrameID") )
    {
        var fd = new FrameData(); 
        var frame = fd.getData("id", a.valueof("$image.FrameID"), ["name"]);
        condition += 	" and ( DOCUMENTID in (select ROW_ID from ATTRLINK join ATTR on ATTRID = VALUE_ID and OBJECT_ID = 9 and ATTRNAME = '" + frame + "')" 
        + " or DOCUMENTID not in (select ROW_ID from ATTRLINK join ATTR on ATTRID = ATTRLINK.ATTR_ID and OBJECT_ID = 9 and  ATTRNAME = 'Doku Vorlagen Verwendung')) ";
    }
    condition = getGrantCondition( "DOCUMENT", condition);
    templatelist = a.sql("SELECT DISTINCT NAME FROM DOCUMENT where " + condition + langcondition + " order by NAME", a.SQL_COLUMN); 
    if ( templatelist[0] == undefined || pLanguage == "" ) // keine passende Sprache beim Kontakt hinterlegt
    {
        // Liest die verfügbaren Sprachen aus, die in den Dokumenten vorhanden sind, und zwar ausgeschrieben
        var availableLangs = a.sql("select distinct(keyname1) from keyword join document on document.lang = keyword.keyvalue where" + getKeyTypeSQL("SPRACHE"), a.SQL_COLUMN);
        // Benutzer wählt sich jetzt seine gewünschte Sprache aus...
        pLanguage = a.askQuestion(a.translate("Keine Vorlage in der gewünschten Sprache gefunden.\nBitte eine Sprache auswählen."), a.QUESTION_COMBOBOX, "|" + availableLangs.join("|"));
        if (pLanguage == null ) return false; 
        // ...und JDito setzt die ausgeschriebene Sprache wieder in das Keyword um, z.B. 'de'
        pLanguage = a.sql("select distinct(lang) from document join keyword on keyword.keyname1 = '" + pLanguage + "' and keyword.keyvalue = document.lang where" + getKeyTypeSQL("SPRACHE"));
        langcondition = " and LANG = " + pLanguage;	
				
        templatelist = a.sql("SELECT DISTINCT NAME FROM DOCUMENT where " + condition + langcondition + " order by NAME", a.SQL_COLUMN); 
    }
	
    if ( templatelist.length > 1) 
    {
        templatename = a.askQuestion(a.translate("Vorlage wählen"), a.QUESTION_COMBOBOX, "|" + templatelist.join("|"));
        if ( templatename == null )return false;
    }
    else templatename = templatelist[0];
	
    var sqlstr = "select NAME, LANG, BINDATA, FILENAME, FIELDIDS, OPENWITHEXPORT, EXPORTFILE, FIELDSEPERATOR, FIELDLIMIT, RECORDSEPERATOR, DOCUMENTID "
    + " from DOCUMENT left join ASYS_BINARIES on TABLENAME = 'DOCUMENT' AND ROW_ID = DOCUMENTID "
    + " where NAME = '" + templatename + "' and " + condition + langcondition;
						 
    return a.sql( sqlstr, a.SQL_ROW );
}

/*
* ersetzt die Platzhalter in ODT-Datei
*
* @author HB
* @version 1.0
* 
* @param {String} pCondition req Condition
* @param {String} pODTFile req Filename des odt-Datei
* @param {String} pAddressID opt ID von der die Adressdaten geholt werden 
* @param {[]} pAdditionalData opt zusätzliche Daten
*
* pAdditionalData =  {Fields: ["RELID", "Platzhalter1","Platzhalter2"],
*                     SQLStr: "select RELATION_ID, ADDR, MEDIUM_ID from COMM",  
*     statt SQLStr    Data: [[]], 
*		      ID: "RELATION_ID" };
*
* @param {[]} pTableData opt Tabellendaten
*
* pTableData = [{  Table: "ADDR", 
*                  Fields: ["RELID", "Type","Strasse","PLZ","Ort","Staat","Land"],
*                  SQLStr: "select RELATION_ID, ADDR_TYPE, " + concat(["ADDRESS", "BUILDINGNO"]) + ", ZIP, CITY, STATE, NAME_DE from ADDRESS join COUNTRYINFO on COUNTRY = ISO2",
*     statt SQLStr Data: [[]],
*     optional     SQLOrder: "STATE, ZIP",
*                  ID: "RELATION_ID" }];
*
* @return {void}
*/
function replaceODTFile( pCondition, pODTFile, pAddressID, pAdditionalData, pTableData )
{
    var i;
    var text;
    var ti;
    var z;
    if ( pTableData == undefined ) pTableData = [];
    if ( pAdditionalData == undefined ) pAdditionalData = {};
    // Configuration für die Platzhalter
    var config = [["RELATIONID","fieldname","RELATION.RELATIONID"]]
    config = config.concat( a.sql("select KEYNAME1, KEYNAME2, KEYDETAIL from KEYWORD where " + getKeyTypeSQL("EXPORTFIELDS"), a.SQL_COMPLETE));
    var addrdata = getAddressesData( pCondition, config, getSendRelID(), pAddressID ); 
    if ( addrdata.length > 1 )
    {
        var relationids = [];
        for (i=1; i < addrdata.length; i++ )	relationids.push(addrdata[i][0]);
        // pTableData aufbereiten
        for (ti = 0; ti < pTableData.length; ti++)
        {
            if( pTableData[ti].SQLStr != undefined )
            {
                if ( pTableData[ti].ID != undefined ) pTableData[ti].SQLStr += " where " + pTableData[ti].ID + " in ('" + relationids.join("','") + "')";
                if ( pTableData[ti].SQLOrder != undefined ) pTableData[ti].SQLStr += " order by " + pTableData[ti].SQLOrder;
                pTableData[ti].Data = a.sql(pTableData[ti].SQLStr, a.SQL_COMPLETE );
            }
            pTableData[ti].TableData =  [];
            for (i=0; i < pTableData[ti].Data.length; i++ )
            {
                if ( pTableData[ti].TableData[pTableData[ti].Data[i][0]] == undefined )  pTableData[ti].TableData[pTableData[ti].Data[i][0]] = [];
                pTableData[ti].TableData[pTableData[ti].Data[i][0]].push( pTableData[ti].Data[i] );
            }
        }
        // pAdditionalData aufbereiten
        if ( pAdditionalData.SQLStr != undefined )
        { 
            if ( pAdditionalData.ID != undefined ) pAdditionalData.SQLStr += " where " + pAdditionalData.ID + " in ('" + relationids.join("','") + "')";
            pAdditionalData.Data = a.sql( pAdditionalData.SQLStr, a.SQL_COMPLETE );
        }
        pAdditionalData.AddData =  [];
        if ( pAdditionalData.Data != undefined )
            for (i=0; i < pAdditionalData.Data.length; i++ )	pAdditionalData.AddData[pAdditionalData.Data[i][0]] = pAdditionalData.Data[i];

        // ersetzen Platzhalter in content.xml
        text = a.decodeBase64String( a.doClientIntermediate(a.CLIENTCMD_GETFROMZIP, [ pODTFile, "content.xml" ]));
        var bodybegin = text.indexOf("<office:body>"); 
        var bodyend =  text.indexOf("</office:body>") + 14;
        var body = text.substring( bodybegin, bodyend );
        var lastbody = text.substr( bodyend );
        text = text.substring( 0, bodybegin );
        for (i = 1; i < addrdata.length; i++)
        {
            var bulkbody = body;
            for (z = 0; z < addrdata[0].length; z++)
            {
                bulkbody = bulkbody.replace( new RegExp( "@@" + addrdata[0][z], "ig"), 
                    addrdata[i][z].replace( new RegExp( "\n", "ig"), "<text:line-break/>").replace( new RegExp( "&", "ig"), "&amp;") );	
            }
            if ( pAdditionalData.AddData[addrdata[i][0]] != undefined )
            {
                bulkbody = relaceAdditionValues( bulkbody, pAdditionalData.Fields, pAdditionalData.AddData[addrdata[i][0]], "" ); 
            }
            // Tabellen füllen
            for (ti = 0; ti < pTableData.length; ti++)
            {
                var tablepos = bulkbody.indexOf( "@@" + pTableData[ti].Table); 
                if ( tablepos != -1 )
                {
                    var tablebegin = bulkbody.lastIndexOf("<table:table-row", tablepos); 
                    var tableend =  bulkbody.indexOf("</table:table-row>", tablepos ) + 18; 
                    var lasttable =  bulkbody.substr( tableend );
                    var tablerow = bulkbody.substring( tablebegin, tableend );
                    bulkbody = bulkbody.substring( 0, tablebegin );
                    var tabledata = pTableData[ti].TableData[addrdata[i][0]];
                    if ( tabledata != undefined )
                    {
                        for (var tz = 0; tz < tabledata.length; tz++)
                        {
                            var table = tablerow;
                            bulkbody += relaceAdditionValues( table, pTableData[ti].Fields, tabledata[tz], pTableData[ti].Table + "." ); 
                        }
                    }
                    bulkbody += lasttable;
                }
            }				
            text += bulkbody; 
        }	
        text +=  lastbody;
        a.doClientIntermediate(a.CLIENTCMD_ADDTOZIP, [pODTFile,  "content.xml", a.encodeBase64String(text)]);						
        // ersetzen Platzhalter in styles.xml
        var styles = a.decodeBase64String( a.doClientIntermediate(a.CLIENTCMD_GETFROMZIP, [ pODTFile, "styles.xml"]));
        for (z = 0; z < addrdata[0].length; z++)
        {
            styles = styles.replace( new RegExp( "@@" + addrdata[0][z], "ig"), 
                addrdata[1][z].replace( new RegExp( "\n", "ig"), "<text:line-break/>").replace( new RegExp( "&", "ig"), "&amp;") );			
        }            
        if ( pAdditionalData.AddData[addrdata[1][0]] != undefined )
        {
            styles = relaceAdditionValues( styles, pAdditionalData.Fields, pAdditionalData.AddData[addrdata[1][0]], "" ); 
        }
        a.doClientIntermediate(a.CLIENTCMD_ADDTOZIP, [ pODTFile, "styles.xml", a.encodeBase64String(styles)]);
        return true;
    }
    return false;

    function relaceAdditionValues( pText, pFields, pValues, pTable )
    { 
        for (var sp = 0; sp < pFields.length; sp++)
        {
            var ph = pFields[sp];
            var value = pValues[sp].toString();
            if ( typeof( ph ) == "object")	
            {
                ph = pFields[sp][0];
                if ( value != "" )
                    switch( pFields[sp][1] )  // Formatierung
                    {
                        case "date":
                            value = date.longToDate(value, pFields[sp][2]);
                            break;
                        case "long":
                            value = a.formatLong(value, pFields[sp][2]);
                            break;
                        case "double":
                            value = a.formatDouble(value, pFields[sp][2]);
                            break;
                    }
            }
            pText = pText.replace( new RegExp( "@@" + pTable + ph, "ig"),
                value.replace( new RegExp( "\n", "ig"), "<text:line-break/>").replace( new RegExp( "&", "ig"), "&amp;") );	
        }
        return pText;
    }
}

/*
* Liefert Vorlage mit ersetzen Platzhalter durch den jeweiligen Text.
*
* @author HB
* @version 1.1
* 
* @param {String} pRelationID req RELATIONID der relation, von der die Adressdaten geholt werden
* @param {Integer} pDocuType req OATYPE der Vorlage 
* @param {String} pLanguage opt Sprache
* @param {String} pAddressID opt pAddressID
* @param {String} pSenderID opt UserRelationID
* @param {String} pTemplateName opt Name der Vorlage
* @param {[]} pAdditionalValues opt Weitere Platzhalter mit Werten
*
* @return {String} mit ausgefüllte Vorlage
*/
function getTextTemplate( pRelationID, pDocuType, pLanguage, pAddressID, pSenderID, pTemplateName, pAdditionalValues )
{
    var retstring = false;
    var value;
    var i;
    var document = chooseTemplate( pDocuType, pLanguage, pTemplateName )
    if ( pAdditionalValues == undefined )  pAdditionalValues = "";
    if ( document.length > 0 )
    {
        retstring = decode64(document[2]);
        var html = retstring.substr(0, 6) == "<html>"
        // Configuration für die Platzhalter
        var config = a.sql("select KEYNAME1, KEYNAME2, KEYDETAIL from KEYWORD where " + getKeyTypeSQL("EXPORTFIELDS"), a.SQL_COMPLETE);
        var addrdata = getAddressesData( [pRelationID], config, pSenderID, pLanguage, pAddressID ); 
        for (i = 0; i < addrdata[0].length; i++)
        {
            if (html) value = addrdata[1][i].replace( new RegExp( "\n", "ig"), "<br>" );
            else 	value = addrdata[1][i];
            retstring = retstring.replace( new RegExp( "@@" + addrdata[0][i], "ig"), value );
        }
        for (i = 0; i < pAdditionalValues.length; i++)
        {
            retstring = retstring.replace( new RegExp( "@@" + pAdditionalValues[i][0], "ig"), pAdditionalValues[i][1] );
        }
    }
    return retstring;
}

/*
* Gibt Fehler bei FileIO aus
*
* @author HB
* @version 1.0
*
* @param {integer} pAction req 
* @param {[]} pDetails req 
*
* @return {boolean}  true wenn Fehler auftritt
*/
function FileIOwithError( pAction, pDetails )
{
    try
    {
        a.doClientIntermediate( pAction, pDetails);
    }
    catch(exception)
    {
        var filename = fileIO.getName(pDetails[0]);
        if ( exception.javaException != undefined )
        { 
            var mtrace = exception.javaException["messageTrace"];
            if ( mtrace.search("10-N-0060-S") > -1 )		a.showMessage(a.translate("Datei '%0' bereits geöffnet!", [filename]));
            else 	if ( mtrace.search("03-N-0124-S") > -1 )	a.showMessage(a.translate("MS-Word nicht installiert !"));
            else 	if ( mtrace.search("00-N-0011-S") > -1 )	a.showMessage(a.translate("Der Datei '%0' ist keine Anwendung zugeordnet.", [filename]));
            else	log.show(exception);
        }
        else log.show(exception);
        return true;
    }
    return false;
}

/*
* Macht aus den Mailattachments Dokumente in einer Dokumentenmappe
*
* @author EP
*
* @param {object} pMail req
* @param {String} pTablename
* @param {String} pContainer
* @param {String} pRowid - Id des verknüpften Datensatzes
*/
function mailAttachmentToDoc( pMail , pTablename , pContainer, pRowid )
{
    var mail = pMail;
    var table = pTablename;
    var cont = pContainer;
    var rowid = pRowid;
    var cols = [ "ID" , "ROW_ID" , "CONTAINERNAME" , "TABLENAME" , "FILENAME" , "BINDATA" , "USER_NEW" , "DATE_NEW" ];
    var colTypes = a.getColumnTypes("ASYS_BINARIES", cols );
    var vals = [ "", rowid , cont , table , "" , "" , a.valueof("$sys.user") , a.valueof("$sys.date") ];
	
	
    for( var i = 0; i < mail[emails.MAIL_ATTACHMENTCOUNT]; i++ )
    {
        vals[0] = a.getNewUUID();
        vals[4] = a.decodeMS( emails.getAttachmentInfos(mail)[i] )[0]; 
        vals[5] = emails.getAttachment( mail , i );
        a.sqlInsert( "ASYS_BINARIES", cols, colTypes, vals )
    }
				
}

/*
* Macht aus den Mailattachments alter Mails Dokumente in einer Dokumentenmappe
*
* @author EP
*
* @param {String} pTablename
* @param {String} pContainer
* @param {Boolean} pDelete
*/
function oldMailAttachmentsToDocs( pTablename , pContainer, pDelete )
{
    ids = a.sql("select HISTORYID, MAIL_ID from HISTORY where DATE_NEW <= " + a.valueof("$sys.date") + " AND MAIL_ID is not null", a.SQL_COMPLETE);
    var mail;
    for(var i = 0; i < ids.length; i++)
    {
        mail = emails.getMail(ids[i][1]) ;

        mailAttachmentToDoc( mail, pTablename , pContainer , ids[i][0] );

        if( pDelete == true ) a.sqlDelete("ASYS_MAILREPOSIT", "ID = '" + a.decodeMS(mail[emails.MAIL_ID])[3] +"'" );
    }	
}

/*
* Öffnet einen Filechooser und merkt sich den letzten Pfad, um bei erneutem Aufruf in diesen zu wechseln
*
* @author EP
*
* @Param {String} pText req Der im Filechooser angezeigte Text
*
* @return {String} [Den Pfad + Dateiname der gewählten Datei. Entsprechend der Rückgabe von a.askQuestion( ..., a.QUESTION_FILECHOOSER, ... )]
*/
function openMemFilechooser( pText )
{
    // Variable für den zuletz geöffneten Pfad initialisieren
    var lastPath = "";
    //Wenn kein Text übergeben wird, wird ein Leerstring gesetzt
    if( pText == null || pText == undefined ) pText = "";
    // Wenn schon ein Pfad aufgerufen wurde, schreibe diesen in lastPath
    if( a.hasvar( "$global.lastPath" ) )
        lastPath = a.valueof( "$global.lastPath" );
    //Öffne den Filechooser mit dem letzten Pfad
    var file = a.askQuestion( pText, a.QUESTION_FILECHOOSER, lastPath );
    //Wenn ein File gewählt wurde, merke den Pfad in dem das gewählte File lag.
    if( file != "" && file != null && file != undefined )
    {
        a.globalvar("$global.lastPath", fileIO.getParent(file) );
    }	
    return file;
}