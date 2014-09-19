import("lib_keyword");
/*
* gibt die benötigten Spaltennamen zurück
* 
* @return {String []} Fieldsname
*/
function getFieldsName()
{
    // Die benötigten Variablen, um die möglichen Adressen für die Relation auszulesen
    return ["LANG", "TEXTBLOCKID", "SHORTTEXT", "LONG_TEXT"];
}

/*

* setzt die Image-Variablen, die für die Beschreibung der Produkte benötigt werden.
* 
* @param {String} pRowID req PRODUCTID
*
* @return {String} pRowID
*/
function setTextBlock( pRowID )
{
    var fieldsname = getFieldsName();
    var product =  new Object(); 
    var productupd =  new Object();
		
    var sqlstr = "select " + ["KEYVALUE", "TEXTBLOCKID", "SHORTTEXT", "LONG_TEXT"].join(", ") 
    + " from KEYWORD left join TEXTBLOCK on KEYVALUE = LANG and ROW_ID = '" + pRowID + "' and TABLENAME = 'PRODUCT' "
    + " where KEYTYPE = 12";

    var list = a.sql( sqlstr, a.SQL_COMPLETE); 
	
    // Packt die daten in ein Objekt
    for (i = 0; i < list.length; i++)	
    {
        var oldvalues = new Object();
        var newvalues = new Object();

        for (y = 0; y < fieldsname.length; y++)
        {
            oldvalues[fieldsname[y]] =  list[i][y];
            newvalues[fieldsname[y]] =  "#*#";
        }
        product[ list[i][0] ] = oldvalues;
        productupd[ list[i][0] ] = newvalues;
    }
    a.imagevar("$image.product", product); // Image-Variable für bestehende Daten (befüllt aus DB)
    a.imagevar("$image.productupd", productupd); // Image-Variable, die später zur Aktualisierung dient (jetzt noch leer)
	
    return pRowID;
}

/*
* liest einzelne Teile des Produkts aus der Altdaten-Image-Variable
* 
* @param {String} pFieldName req Der Feldname (z.B. "SHORTTEXT")
* @param {String} pLanguage req Sprache des Inhalts des zurückzugebenden Textblockfeldes
* 
* @return {String} mit dem Wert
*/
function getTextblockField( pFieldName, pLanguage )
{
    ret = "";
    if ( pFieldName != "" && pLanguage != "" )
    {
        ret = a.valueofObj("$image.product")[pLanguage][pFieldName];
    }
    return ret;
}

/*
* setzt einzelne Teile des Produkts in den beiden Image-Variablen
* 
* @param {String} pFieldName req Der Feldname (z.B. "SHORTTEXT")
* @param {Integer} pLanguage req Sprache des Inhalts des zu setzenden Textblockfeldes
* @param {String} pValue req der neue Wert der Variable
*
* @return {void}
*/
function setTextblockField( pFieldName, pLanguage, pValue )
{	
    if ( pLanguage != ""  )
    {
        if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW || a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT )
        { 
            var product = a.valueofObj("$image.product")
            var productupd = a.valueofObj("$image.productupd")
			
            product[pLanguage][pFieldName] = pValue;
            productupd[pLanguage][pFieldName] = pValue;				
        }
    }
}

/*
* speichert die Daten eines Textblocks der neuen Image-Variable und aktualisiert oder erstellt neu
*
* @param {String} pRowID req ID des Produktes
* @param {Integer} pLanguage req	Sprache
*
* @return {void}
*/
function saveTextblock( pRowID, pLanguage )
{
    var fieldsname = getFieldsName();
    var product =  a.valueofObj("$image.product");
    var productupd =  a.valueofObj("$image.productupd");
    var i;
	
    // Pro Adresstyp Änderungen feststellen und speichern
    for ( language in productupd )
    {
        var oldvalues = product[language];
        var newvalues = productupd[language];
        var columns = new Array();		
        var cvalues = new Array();
        for (i = 1; i < fieldsname.length; i++ )
        {	
            if ( oldvalues[fieldsname[i]] == newvalues[fieldsname[i]] )
            { 
                columns.push( fieldsname[i] );
                cvalues.push( newvalues[fieldsname[i]] );
            }
        }
        if ( columns.length > 0 ) // Es hat sich was geändert
        {
            // Prüfen ob Addressfelder leer			
            var empty = true;
            for (i = 2; i < fieldsname.length; i++ )
            {
                if ( oldvalues[fieldsname[i]] != "" )
                {		
                    empty = false;
                    break;
                }    
            }
			
            if ( oldvalues["TEXTBLOCKID"] == "" ) // ist die TEXTBLOCKID leer
            {
                columns.push( "TEXTBLOCKID" ); 
                cvalues.push( a.getNewUUID() );			
                columns.push( "LANG" ); 
                cvalues.push( language );			
                columns.push( "ROW_ID" ); 
                cvalues.push( pRowID );			
                columns.push("TABLENAME");
                cvalues.push("PRODUCT");	
                columns.push("AOTYPE");
                cvalues.push("1");
            }

            var columnstype = a.getColumnTypes("TEXTBLOCK", columns);
            if ( oldvalues["TEXTBLOCKID"] == "" ) // Insert
            {
                if (!empty ) {
                    a.sqlInsert("TEXTBLOCK", columns, columnstype, cvalues);
                }
            }
            else  // Update oder Löschen
            {
                if ( empty && pLanguage != 1 ) 
                {
                    a.sqlDelete("TEXTBLOCK", "TEXTBLOCKID = '" + oldvalues["TEXTBLOCKID"] + "'" );
                }	else {
                    a.sqlUpdate("TEXTBLOCK", columns, columnstype, cvalues, "TEXTBLOCKID = '" + oldvalues["TEXTBLOCKID"] + "'" );
                }
            }
        }
    }
    // newvalues zurücksetzen
    setTextBlock(pRowID);
}