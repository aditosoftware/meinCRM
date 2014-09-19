import("lib_addr");
import("lib_document");
import("lib_keyword");
import("lib_history");

/*
* Brief schreiben.
* 
* @param {String} pRelID req Relation
* @param {String} pAddressID opt ID von der die Adressdaten geholt werden 
* @param {String} pLanguage opt die Sprache des Dokuments
* @param {String} pTemplateType opt  Dokumentenvorlage-Type ( Keyword )
* @param {Object} pAdditionalData opt weitere Daten
* @param {Object []} pTableData opt Tabellendaten
* 
* @return {Boolean}
*/
function writeLetter( pRelID, pAddressID, pLanguage, pTemplateType, pAdditionalData, pTableData )
{
    if ( pTemplateType == undefined ) pTemplateType = 1; 
    if(pRelID != "")
    {
        var document = chooseTemplate( pTemplateType, pLanguage )
        if ( document.length > 0 )
        {
            if ( document[2] != "" )
            {
                var fname = a.valueof("$sys.clienttemp") + "/" + document[3].replace(/\\/g, "/");
                var ext = document[3].split(".");
                if ( ext[ext.length-1] == "xml" ) // XML
                {
                    retstring = a.decodeBase64String(document[2]);
                    
                    // Formatierungen zwischen den Platzhaltern entfernen Platzhalter muss in {} stehen.
                    var match = retstring.match(new RegExp("{.+?}", "g"));
                    for ( i = 0; i < match.length; i++ )
                    {
                        var placeholder =  match[i].replace(new RegExp("<.+?>", "g"),"");
                        retstring = retstring.replace( match[i], placeholder.substr( 1, placeholder.length - 2 ) );
                    } 

                    var config = a.sql("select KEYNAME1, KEYNAME2, KEYDETAIL from KEYWORD where " + getKeyTypeSQL("EXPORTFIELDS"), a.SQL_COMPLETE);
                    var addrdata = getAddressesData( [pRelID], config, getSendRelID(), pLanguage, pAddressID ); 
                    for (var i = 0; i < addrdata[0].length; i++)
                    {
                        retstring = retstring.replace( new RegExp( "@@" + addrdata[0][i], "ig"), addrdata[1][i].replace( new RegExp( "\n", "ig"),
                            '</w:t></w:r></w:p><w:p w:rsidR="00FF77C0" w:rsidRDefault="00550702"><w:r><w:t>') );
                    }
                    if ( FileIOwithError( a.CLIENTCMD_STOREDATA, [ fname, a.encodeBase64String(retstring), a.DATA_BINARY ] ) ) return false;
                    if ( FileIOwithError( a.CLIENTCMD_OPENFILE, new Array(fname) ) ) return false;
                }
                else if ( ext[ext.length-1] == "odt" )  // ODT
                {
                    var sqlstr = "select VALUE_CHAR from ATTRLINK join ATTR on ATTRID = ATTRLINK.ATTR_ID where OBJECT_ID = 9 and ROW_ID = '" + document[10] + "' and ATTRNAME = ";
                    if ( pAdditionalData == undefined )
                    {
                        var additionaldata = a.sql(sqlstr + "'weitere Daten'" );
                        if ( additionaldata != "" ) eval( "pAdditionalData = {" + additionaldata + "}" );
                    }
                    var tabledata = a.sql(sqlstr + "'Tabellen Daten'", a.SQL_COLUMN );
                    if ( pTableData == undefined ) pTableData = [];
                    if ( tabledata.length > 0 ) eval( "pTableData.push({" + tabledata.join("},{") + "})" );
                    if ( FileIOwithError( a.CLIENTCMD_STOREDATA, [ fname, document[2], a.DATA_BINARY ] ) ) return false;
                    replaceODTFile([pRelID], fname, pAddressID, pAdditionalData, pTableData );
                    if ( FileIOwithError( a.CLIENTCMD_OPENFILE, [ fname ] ) ) return false;
                }
                else // runscript
                {
                    if ( FileIOwithError( a.CLIENTCMD_STOREDATA, [ fname, document[2], a.DATA_BINARY ] ) ) return false;
                    var tempfile =  a.valueof("$sys.clienttemp") + "/" + "run.vbs";
                    if ( FileIOwithError( a.CLIENTCMD_STOREDATA, [ tempfile, getScript( pRelID, fname, pAddressID ), a.DATA_TEXT, false, "UTF-16LE"]) ) return false; 
                    if ( FileIOwithError( a.CLIENTCMD_OPENFILE, [ tempfile ] ) ) return false; 
                }
                InsertHistory([pRelID], "Brief", "o", "Einzelbrief", a.translate("Brief in Datenbank hinterlegt: ") + document[0], [], [fname]  );
                return true;
            }
            else a.showMessage(a.translate("Kein Dokument in Vorlage '%0'", [ document[0] ] ));
        }
    }
    return false;
}

/*
* erzeugt VBScribt für MSWord
*
* @param {String} pRelID req Relation
* @param {String} pFile req Filename des Worddokuments
* @param {String} pAddressID opt ID von der die Adressdaten geholt werden 
*
* @return {String} VBScribt
*/
function getScript( pRelID, pFile, pAddressID )
{
    // Configuration für die Platzhalter
    var config = a.sql("select KEYNAME1, KEYNAME2, KEYDETAIL from KEYWORD where " + getKeyTypeSQL("EXPORTFIELDS"), a.SQL_COMPLETE);

    var addrdata = getAddressesData( [pRelID], config, getSendRelID(), pAddressID ); 

    var script = '\r\n '
    + '\r\n set obj = createobject("Word.Application")'
    + '\r\n obj.Visible = true'
    + '\r\n dim fname'
    + '\r\n fname = "' + pFile + '"'
    + '\r\n obj.Documents.Open fname'
    + '\r\n set sel = obj.Selection'
    + '\r\n sel.Find.ClearFormatting'
    + '\r\n sel.Find.Replacement.ClearFormatting'		
    + '\r\n dim txt\r\n';

    script += "\r\n";
    for (var i = 0; i < addrdata[0].length; i++)  // Kopfzeile
    {
        var str = addrdata[1][i];  // Datenzeile
        str = str.replace( new RegExp('"',"g" ), '""');
        str = str.replace( /\r\n/g , '" & vbCR & "');
        str = str.replace( /\n/g , '" & vbCR & "');
        str = str.replace( /\r/g , '" & vbCR & "');

        script += '\r\n sel.Find.Execute "@@' +  addrdata[0][i] + '", false, false, false, false, false, true, 1, false, "' 
        + str + '", 2, false, false, false, false'
    }
    return script;
}