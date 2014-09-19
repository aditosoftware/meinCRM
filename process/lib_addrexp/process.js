import("lib_addr");
import("lib_history");
import("lib_document");
import("lib_keyword");
import("lib_relation");


/*
* Öffnet einen Serienbrief mit Adressen der übergebenen RELATIONID.
*
* @param {String} pCondition req Condition oder Array pCondition req mit RelationIDs für die zu lesende Datensätze
* @param {Integer} pDocuType opt enthält Dokumententype 
* @param {Object} pAdditionalData opt weitere Daten
* @param {String [[]]} pTableData opt Tabellendaten
*
* @return {Booelan}
*/
function openSerialLetter ( pCondition, pDocuType, pAdditionalData, pTableData )
{
    var filelist;
    pCondition = getCommRestrictionCondition( pCondition, 5 ); // 5 = kein Serien-Brief
    ret = false;
    if ( pDocuType == undefined ) pDocuType = 2;
    var document = chooseTemplate( pDocuType )
    if ( document.length > 0 && document[2].length > 0) 
    {
        var templatename = document[3];
        var	templatefile = a.valueof("$sys.clienttemp") + "/" + templatename;
        var	templatedata = document[2];
        filelist = [ templatefile ];
        var details = [ templatefile, templatedata, a.DATA_BINARY ];
        var ext = templatename.split(".");
        if ( ext[ext.length-1] == "odt" ) // ODT
        {
            var sqlstr = "select VALUE_CHAR from ATTRLINK join ATTR on ATTRID = ATTRLINK.ATTR_ID where OBJECT_ID = 9 and ROW_ID = '" + document[10] + "' and ATTRNAME = ";
            if ( pAdditionalData == undefined )
            {
                var additionaldata = a.sql(sqlstr + "'weitere Daten'");
                if ( additionaldata != "" ) eval( "pAdditionalData = {" + additionaldata + "}" );
            }
            var tabledata = a.sql(sqlstr + "'Tabellen Daten'", a.SQL_COLUMN );
            if ( pTableData == undefined ) pTableData = [];
            if ( tabledata.length > 0 ) eval( "pTableData.push({" + tabledata.join("},{") + "})" );
            if ( FileIOwithError( a.CLIENTCMD_STOREDATA, details ) ) return false;
            if ( ! replaceODTFile( pCondition, templatefile, undefined, pAdditionalData, pTableData ) ) return false;
            if ( FileIOwithError( a.CLIENTCMD_OPENFILE, details ) ) return false;
        }
        else // DOC
        {
            if ( exportData( pCondition, document, getSendRelID() ) )
            {
                if ( FileIOwithError( a.CLIENTCMD_STOREDATA, details ) ) return false;
                if ( FileIOwithError( a.CLIENTCMD_OPENFILE, details ) ) return false;
                filelist = [ templatefile, a.valueofObj("$image.controlfile") ];
            }
            else return false;
        }
        InsertHistory( pCondition, "Serienbrief", "o", "Serienbrief", a.translate("Serienbrief %0 eingetragen", [templatename]), [], filelist );
        ret = true;
    }
    else	a.showMessage(a.translate("Keine Vorlage vorhanden!"));
    return ret;
}

/*
* Öffnet einen Serienbrief mit Adressen der übergebenen RELATIONID.
*
* @param {String} pCondition req Condition
        oder Array pCondition req mit RelationIDs
* @param {String} pLanguage opt Sprache
*
* @return {void}
*/
function openExport ( pCondition, pLanguage )
{
    var document = chooseTemplate( "7", pLanguage )
    if ( document.length > 0 ) 	exportData( pCondition, document );
}

/*
* Erzeugt eine Exportdatei
*
* @param {String} pCondition req SQL-Where-Condition  
	oder Array pCondition req mit RelationIDs
* @param {String} pDocument req Document
* @param {String} pSenderID opt UserRelationID
*
* @return {boolean} true = export ohne Fehler
*/

function exportData( pCondition, pDocument, pSenderID )
{ 
    // Document
    var isexported = false;
    var name = pDocument[0];
    var keys;
    var file = pDocument[6];					// Exportfile
    if ( file == "" ) file = a.askQuestion(a.translate("Bitte wählen Sie die Exportdatei aus"), a.QUESTION_FILECHOOSER,
        a.valueof("$global.Exp_Temp") + "/" + name + ".txt");	
    keys = pDocument[4];
    if (keys != '' && file != null )
    {
        var RecordSep = pDocument[9];					// Zeilentrenner
        if (RecordSep == "CRLF") RecordSep = '\r\n';
        var FieldSep = pDocument[7];	 		 			// Feldtrenner
        if ( FieldSep == "tab" ) FieldSep = '\t'; else FieldSep = FieldSep.charAt(0);
        var FieldLimit = pDocument[8].charAt(0); // Feldbegrenzer
        var openFile = pDocument[5]; 
        if ( openFile == "1" ) 	openFile = true; else	openFile = false;
        keys = a.decodeMS(keys)
        var keylist = a.sql("select KEYNAME1, KEYNAME2, KEYDETAIL from KEYWORD where KEYVALUE in (" + keys.join(", ") + ") and " 
            + getKeyTypeSQL("EXPORTFIELDS") + " order by KEYSORT", a.SQL_COMPLETE);

        var data = getAddressesData( pCondition, keylist, pSenderID );
        if ( data.length > 0 )
        {
            if ( FileIOwithError( a.CLIENTCMD_STOREDATA, new Array( file, a.toCSV(data, RecordSep, FieldSep, FieldLimit) ) ) ) return false;
            isexported = true;
            if ( openFile )	if ( FileIOwithError(a.CLIENTCMD_OPENFILE, [ file ]) ) return isexported;
            a.imagevar( "$image.controlfile", file );		
        }
    }
    return isexported;
}