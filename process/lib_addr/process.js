import("lib_keyword");
import("lib_attr");

/*
* Objekt mit folgenden Methoden:
*     String formatAddress( pFormat )	gibt formatierte Addresse wie im pFormat zurück
*     String getFormattedAddress() gibt formatierte Addresse wie in Country hinterlegt zurück]
* 
* @param {String} pRelationID req RELATIONID der relation, von der die Adressdaten geholt werden
* @param {String} pAddressID opt ID von der die Adressdaten geholt werden 
* 
* @return {String}
*/

function AddrObject( pRelationID, pAddressID )
{
    this.Data = fetchAddressData( [ pRelationID ] , [["", "addressformat", ""]], pAddressID );
    this.fmt = this.Data[0][0][26]; // Format Country	
    
    /*
    * Erzeugt eine formatierte Adresse mit einem bestimmten Format
    * 
    * @param {String} pFormat   z.B.: {on} {ln}  = Orgname Lastname
    * 
    * @return {String} formatierte Adresse
    */    
    this.formatAddress = function( pFormat )
    {		    
        return _formatAddrData( _getAddrData(  this.Data[0][0] ), pFormat );
    }
	
    /*
    * Erzeugt eine formatierte Adresse
    * 
    * @return {String} formatierte Adresse
    */
    this.getFormattedAddress = function()
    {		    
        return _formatAddrData( _getAddrData(  this.Data[0][0] ) );
    }
}

/*
* Erzeugt Adress Daten
* 
* @param {String} pCondition req SQL-Where-Condition  
* @param {String [[]]} pConfig req ( Name, FunktionsArt, Details )
* @param {String} pSenderID opt UserRelationID
* @param {String} pAddressID opt ID von der die Adressdaten geholt werden 
* 
* @return {[]}  Daten 
*/
function getAddressesData( pCondition, pConfig, pSenderID, pAddressID )
{ 
    var returndata = [];
    var senderconfig = [];
    var employeeconfig = [];
    var config = [];
    for ( var i = 0; i < pConfig.length; i++ )
    {
        var type = pConfig[i][1].split(".");
        switch( type[0] )
        {
            case "employee":
                employeeconfig.push([pConfig[i][0], type[1], pConfig[i][2]]);
                break;
            case "sender":
                senderconfig.push([pConfig[i][0], type[1], pConfig[i][2]]);
                break;
            default:
                config.push(pConfig[i]);
                break;
        } 
    }
    var data = getAddressData( pCondition, config, pAddressID );
    if ( pSenderID == undefined )  pSenderID = a.valueof("$global.user_relationid");
    if ( senderconfig.length > 0 ) 
        var senderdata = getAddressData( [ pSenderID ], senderconfig );
    if ( employeeconfig.length > 0 ) 
        var employeedata = getAddressData( [ a.valueof("$global.user_relationid") ], employeeconfig );
    if ( data.length > 0 && ( senderconfig.length > 0 || employeeconfig.length > 0  ) )
    { 
        var ze = data[0];
        if ( employeeconfig.length > 0 ) ze = ze.concat( employeedata[0] );
        if ( senderconfig.length > 0 ) ze = ze.concat( senderdata[0] ); 
        returndata.push(ze);
        for ( i = 1; i < data.length; i++ )
        {
            ze = data[i];
            if ( employeeconfig.length > 0 ) ze = ze.concat( employeedata[1] );
            if ( senderconfig.length > 0 ) ze = ze.concat( senderdata[1] ); 
            returndata.push(ze);
        }
        return returndata;
    }
    else	return data;
}

/*
* Erzeugt Address Daten
* 
* @param {String} pCondition req SQL-Where-Condition  
* @param {String [[]]} pConfig req ( Name, FunktionsArt, Details )
* @param {String} AddressID opt ID von welchem die Adressdaten geholt werden
* 
* @return {[]}  Daten 
*/
function getAddressData( pCondition, pConfig, AddressID )
{ 
    return setAddressData( fetchAddressData( pCondition, pConfig, AddressID ) );
}

/*
* liest Daten aus der Datenbank
* 
* @param {String} pCondition req SQL-Where-Condition  
* @param {String [[]]} pConfig req ( Name, FunktionsArt, Details )
* @param {String} AddressID opt ID von welchem die Adressdaten geholt werden
* 
* @return {[]}  Daten 
*/
function fetchAddressData( pCondition, pConfig, AddressID  )
{ 
    // wenn RelationIDs statt Condition
    if ( typeof(pCondition) == "object") pCondition = "RELATION.RELATIONID in ('" + pCondition.join("','") + "')";
    if ( pConfig.length > 0 )
    { 
        var header = [];
        var fields = [];
        var output = [];
        var pos = 0;
        var posaddrfields = -1;
		
        var addrfields = ["case when RELATION.PERS_ID is null then 1 else case when " + trim("RELATION.ORG_ID") + " = '0' then 2 else 3 end end",
        "ADDRESS.ADDRESS", "ADDRESS.BUILDINGNO", "ADDRESS.ZIP", "ADDRESS.CITY", "ADDRESS.COUNTRY", "ADDRESS.ADDRESSADDITION",  // 1
        "ADDRESS.ADDRIDENTIFIER", "ADDRESS.DISTRICT", "ADDRESS.REGION", "ADDRESS.STATE", "RELATION.DEPARTMENT", "RELATION.RELTITLE", // 7
        "RELATION.RELPOSITION", "RELATION.LETTERSALUTATION", "ORG.ORGNAME", "PERS.FIRSTNAME", "PERS.MIDDLENAME", "PERS.LASTNAME",  // 13
        "PERS.SALUTATION", "PERS.TITLE", "PERS.SUFFIX", // 19
        "coalesce( RELATION.LANG, (select ORGREL.LANG from RELATION ORGREL where ORGREL.ORG_ID = RELATION.ORG_ID and PERS_ID is null))", // 22
        "''", "''", "''", "(select ADDRFORMAT from COUNTRYINFO where ISO2 = ADDRESS.COUNTRY)"]; // 23
											
        for (var i=0; i < pConfig.length; i++ )
        {
            switch( pConfig[i][1] )
            {
                case "fieldname":		// Angabe von Datenbankfelder
                    fields.push( pConfig[i][2] );
                    output.push([pos++, pConfig[i][1]]);
                    header.push( pConfig[i][0] );
                    break;
                case "function":		// Angabe von aditoSQL Funktionen
                    fields.push( eval( a.resolveVariables(pConfig[i][2]) ) );
                    output.push([pos++, pConfig[i][1]]);
                    header.push( pConfig[i][0] );
                    break;
                case "afunction":		// Angabe von aditoFunktionen
                    try
                    {
                        fields.push( "'" + eval( a.resolveVariables(pConfig[i][2]) ).replace(new RegExp("'","g"), "''") + "'" ); 
                        output.push([pos++, pConfig[i][1]]);
                        header.push( pConfig[i][0] );
                    }catch( err )
                    {
                        log.log( err )
                    }
                    break;
                case "select":	// Angabe von Subselects
                    fields.push( "(" + a.resolveVariables(pConfig[i][2]) + " )" );
                    output.push([pos++, pConfig[i][1]]);
                    header.push( pConfig[i][0] );
                    break;
                case "addressformat":		// Angabe von Addressformat
                    if ( posaddrfields == -1 )
                    {
                        fields.push( addrfields.join(", ") );
                        posaddrfields = pos;
                        pos += addrfields.length;								
                    }
                    output.push([posaddrfields, pConfig[i][1], pConfig[i][2]]);
                    header.push( pConfig[i][0] );
                    break;
            }
        }
        var sqlstr =  "select " + fields.join(",") 
        + " from RELATION join ORG on RELATION.ORG_ID = ORG.ORGID "
        + " left join PERS on RELATION.PERS_ID = PERS.PERSID "
        + " left join ADDRESS on ADDRESS.ADDRESSID = ";
										
        if ( AddressID != undefined && AddressID != "" )  sqlstr += "'" + AddressID + "'"; 
        else sqlstr += "RELATION.ADDRESS_ID"; 

        if ( pCondition != "" ) sqlstr += " where " + pCondition;
        var data = a.sql(sqlstr, a.SQL_COMPLETE);
        data = [ data, output, header, addrfields ];
    }
    return data;
}

/*
* liest Daten aus der Datenbank
* 
* @param {String [[]]} pData req Array von Array Daten  
* 
* @return {String [[]]}  Daten 
*/
function setAddressData( pData )
{ 
    var sqlresult = pData[0];
    var data = [];
    if ( sqlresult.length > 0 )
    {
        var output = pData[1]; 
        var header = pData[2];
        var addrfields = pData[3];
        data.push( header );
        for ( var i = 0; i < sqlresult.length; i++ )
        {		
            var addrdata = [];
            var row = [];	
            // Wenn addressformat einmal angefordert dann erzeugen der Daten
            for ( var z = 0; z < header.length; z++ )
            {
                switch( output[z][1] )
                {
                    case "fieldname":
                    case "function":
                    case "afunction":
                    case "select":
                        row[z] = sqlresult[i][output[z][0]];
                        break;
                    case "addressformat":
                        if (addrdata.length == 0)	addrdata = _getAddrData( sqlresult[i].slice(output[z][0], output[z][0] + addrfields.length) );
                        row[z] = _formatAddrData( addrdata, output[z][2] );
                        break;
                }
            }
            data.push( row );
        }
    }
    return data;
}
/*
*
* gibt formatierte Addresse zurück
*
* @param {String [[]]} pData req Daten 
*
* @return {String [[]]} aufbereitete Daten
*/
function _getAddrData( pData )
{
    var lettersalutation = pData[14];
    var salutation = pData[19];
    var sformat = "";
    switch( Number(pData[0]) )
    {
        case 1:
            if ( lettersalutation == "" ) 
            {
                sformat = _getSalutation( pData[22] );
                if ( sformat != undefined && sformat[1] != "" ) lettersalutation = _formatAddrData( pData,  sformat[1] );
                else lettersalutation = "Sehr geehrte Damen und Herren";
            }
            break;
        case 2:
            // orgname "Privat" löschen
            pData[15] = "";

        case 3:
            sformat = _getSalutation( pData[22] + pData[19] + pData[20] );
            // falls keine Sprache hinterlegt nur Anrede + Titel verwenden
            if ( sformat == undefined )  sformat = _getSalutation( pData[19] + pData[20] );
            // kein Sprachenspezifischen Eintrag für Anrede und Titel in der Tabelle SALUTATION
            if ( sformat == undefined || sformat[0] == "" || sformat[1] == "" )	sformat = ["{sa} {ti} {fn} {ln}", "{sa} {ti} {ln}"];
            salutation = _formatAddrData( pData,  sformat[0] );
            // falls keine abweichende Briefanrede angegeben, wird hier eine aufbereitet
            if( lettersalutation == "" )		lettersalutation = _formatAddrData( pData, sformat[1] );
    }

    pData[23] = salutation;
    pData[24] = lettersalutation;
    pData[25] = _getCountryName(pData[5]);
    return pData;
}

/*
* [gibt formatierte Anrede zurück]
* 
* @param {String} pSalutCode req AnredeCode
* 
* @return {String} übersetzter Salutation 
*/
function _getSalutation( pSalutCode )
{
    var salut = new Object();
    if ( a.hasvar("$global.Salutation"))	salut = a.valueofObj("$global.Salutation");
    else
    {	
        var list = a.sql("select LANGUAGE, SALUTATION, TITLE, HEADLINE, LETTERSALUTATION from SALUTATION", a.SQL_COMPLETE);
        for ( var i = 0; i < list.length; i++ )	
        {   
            salut[list[i][0] + list[i][1] + list[i][2]] = [list[i][3], list[i][4]];
            salut[list[i][1] + list[i][2]] = [list[i][3], list[i][4]];
        }
        a.globalvar("$global.Salutation", salut);
    }
    return salut[pSalutCode];
}

/*
* gibt Ländername zurück
*
* @param {String} pCountryCode req Ländercode
*
* @return {String} übersetzter Ländername
*/
function _getCountryName(pCountryCode)
{
    var countryname = new Object();
    if ( a.hasvar("$global.CountryName"))	countryname = a.valueofObj("$global.CountryName");
    else
    {	
        var list = a.sql("select ISO2, NAME_DE from COUNTRYINFO", a.SQL_COMPLETE);
        for (var i=0; i < list.length; i++ )	countryname[list[i][0]] = a.translate( list[i][1] );
        a.globalvar("$global.CountryName", countryname);
    }
    return countryname[pCountryCode];
}

/*
* gibt formatierte Addresse zurück
*
* @param {String [[]]} pAddrData req Daten 
* @param {String} pFormat opt Format
*
* @return {String} formatierte Adresse
*/
function _formatAddrData( pAddrData, pFormat )
{
    var placeholder = [["al", 1],["bn", 2],["zc", 3],["ci", 4],["cc", 5],["aa", 6],["ai", 7],["di", 8],["rg", 9],["st", 10],["dp", 11],
    ["rt", 12],["rp", 13],["on", 15],["fn", 16],["mn", 17],["ln", 18],["sa", 19],["ti", 20], ["sf", 21], ["hs", 23], 
    ["ls", 24], ["cn", 25],["on1", 0],["on2", 1],["on3", 2],["on4", 3]];	

    var as = pAddrData[26];
    if ( pFormat != "" && pFormat != undefined) as = pFormat; 
    var on = pAddrData[16].split("\n");
		
    for( var y = 0; y < placeholder.length; y++ )
    {
        // Orgname auf Zeilen aufteilen on1 - on4
        if ( y > 22 ) 	
        {
            if ( on[ placeholder[y][1] ]	== undefined )   as = as.replace(new RegExp("{" + placeholder[y][0] + "}", "g"), "");
            else	as = as.replace(new RegExp("{" + placeholder[y][0] + "}", "g"), on[ placeholder[y][1]]).replace(/(^\s+)|(\s+$)/g,"");
        }
        else
        {
            // jetzt die werte einfuellen fuer lowercase bzw. unveraendertvar
            as = as.replace(new RegExp("{" + placeholder[y][0] + "}", "g"), pAddrData[ placeholder[y][1] ]);
            // jetzt die werte einfuellen 
            if (   pAddrData[ placeholder[y][1] ] != undefined )	as = as.replace(new RegExp("{" + placeholder[y][0].toUpperCase() + "}", "g"), pAddrData[ placeholder[y][1] ].toUpperCase());
        }		

    }
	 	
    as = as.replace(/^\n/, "");  // CR am Anfang entfernen;
    as = as.replace(/  /g, " "); // doppelte leerzeichen entfernen
    as = as.replace(/\\n/ig, "\n");	// newline marker ersetzen
    as = as.replace(/ *\n */g, "\n");// leerzeichen am ende und Anfang entfernen
    as = as.replace(/\s(?=\s)/g, "");	// leerzeilen rauswerfen

    return as;
}

/*
* Gibt die RelationID des Senders zurück
* 
* @return {String} RelationID
*/
function getSendRelID()
{
    // Attribute von Employee
    var EmplFrameID = new FrameData().getFrameID("EMPLOYEE");
    var relationid = a.valueof("$global.user_relationid");
    var employeeid = a.sql( "select EMPLOYEEID from EMPLOYEE where RELATION_ID = '" + relationid + "'");	
    var username = GetAttribute( "schreibt für", EmplFrameID, employeeid );
    if ( username.length > 0 )
    {
        var ret = a.askQuestion(a.translate("Bitte Absender wählen"), a.QUESTION_COMBOBOX, "|" + a.translate("eigener Absender") + "|" + username.join("|"));
        if ( ret != null )
        {
            var relids = GetAttributeKey( "schreibt für", EmplFrameID, employeeid );
            for ( var i = 0; i < username.length; i++ )
            { 		
                if ( username[i] == ret )
                {
                    relationid = relids[i];
                    break;
                }
            }
        }
    }
    return relationid;
}

/*
* Gibt die RelationID des Senders zurück]
*
* @return {String} RelationID
*/
function getSendRelID()
{
    // Attribute von Employee
    var EmplFrameID = new FrameData().getFrameID("EMPLOYEE");
    var relationid = a.valueof("$global.user_relationid");
    var employeeid = a.sql( "select EMPLOYEEID from EMPLOYEE where RELATION_ID = '" + relationid + "'");	
    var username = GetAttribute( "schreibt für", EmplFrameID, employeeid );
    if ( username.length > 0 )
    {
        var ret = a.askQuestion(a.translate("Bitte Absender wählen"), a.QUESTION_COMBOBOX, "|" + a.translate("eigener Absender") + "|" + username.join("|"));
        if ( ret != null )
        {
            var relids = GetAttributeKey( "schreibt für", EmplFrameID, employeeid );
            for ( var i = 0; i < username.length; i++ )
            { 		
                if ( username[i] == ret )
                {
                    relationid = relids[i];
                    break;
                }
            }
        }
    }
    return relationid;
}