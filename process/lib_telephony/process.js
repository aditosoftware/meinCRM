import("lib_keyword");
import("lib_validation");

/*
* Ruft eine Nummer an.
* 
* @param {String} pPhoneNumber req die Telefonnummer
* 
* @return {void}
*/
function call(pPhoneNumber)
{
    var phoneNumber = "";
    try     // plugin vorhanden 
    {
        var country = a.sql("select COUNTRY from RELATION join EMPLOYEE on RELATIONID = EMPLOYEE.RELATION_ID "
            + " join ADDRESS on ADDRESSID = ADDRESS_ID and LOGIN = '" + a.valueof("$sys.user") + "'");
        phoneNumber = SYSTEM.runPlugin( null, "de.adito.PhoneNumberPlugin.CallNumberFormatter", [country, country, pPhoneNumber ])[0];
        if ( phoneNumber != undefined && phoneNumber != null && phoneNumber != "" )
             phoneNumber = a.valueof("$sys.outsidelineaccess") + phoneNumber;
        else phoneNumber = getPhoneNumber(pPhoneNumber);
    }
    catch(ex)
    {
        phoneNumber = getPhoneNumber(pPhoneNumber)
    }
    telephony.call( phoneNumber );
}


/*
* Bereiningt die Telefonnummber für die Verwendung mit CTI.
*
* @param {String} s req Telefonnummer
*
* @return {String} die bereinigte Telefonnummer
*/
function getPhoneNumber(s)
{
    var prefix = a.valueof("$global.user_phone");
    if ( prefix != "" )	prefix = getPhoneParts( prefix )[0].replace(/^\+/, "");
    else prefix = "49";
    // leerzeichen weg
    s = s.replace(/\s/g, "");

    // jetzt auf +49 und 0049 testen
    s = s.replace(new RegExp("^[\+|0+]" + prefix ), "0");

    // führendes + zu 00
    s = s.replace(/^(\+)/, "00");

    // alles weg, was keine ziffer ist
    s = s.replace(/\D/g, "");
		 
    // amtsholung dazu
    s = a.valueof("$sys.outsidelineaccess") + s;
    return s;
}

/*
* Bereiningt die Telefonnummer für die Verwendung mit CTI.
*
* @param {String} s req Telefonnummer
* 
* @return {String} die bereinigte Telefonnummer
*/
function cleanPhoneNumber(s)
{
    // leerzeichen weg
    s = s.replace(/\s/g, "");

    // führendes + zu 00
    s = s.replace(/^(\+)/, "00");

    // alles weg, was keine ziffer ist
    s = s.replace(/\D/g, "");

    // alle führnde 0 weg
    s = s.replace(/^0+/, "");
  
    return s;
}

/*
* Sucht die gespeicherte Suchadresse raus.
*
* @param {String} pMedium req Medium
* @param {String} pAdresse req Telefonnummer
*
* @return {String} adr
*/
function getSearchAddr( pMedium, pAdresse)
{
    var adr = "";
    var fon = a.sql("select count(*) from keyword where" +getKeyTypeSQL(["OrgMedium","PersMedium"]) + " and keyname2 = 'fon' and keyvalue = " + pMedium);
    if ( fon > 0 ) adr = cleanPhoneNumber( pAdresse );
    return adr;
}

/*
* öffnet den Kontact der Telefonnummer.
*
* @param {String} pCtiLogID req ID des Logs
*
* @return {String} adr
*/
function openCTIContact( pCtiLogID )
{
    var call = a.sql("select RELATION_ID, ADDRESS from CTILOG where CTILOGID = '" + pCtiLogID + "'", a.SQL_ROW);
    openCallerFrame( [call[0]] ,call[1] );
}

/*
* gibt die relationids der Nummer zurück 
*
* @param {String} pCallAddress req Telefonnummer
*
* @return {String []} RelationId
*/
function getRelIDsfromCall( pCallAddress )
{
    return a.sql("select RELATION_ID from COMM where SEARCHADDR like '%" + pCallAddress.replace(/^0+/, "") + "'", a.SQL_COLUMN);
}

/*
* Öffnet ein Frame und zeigt die Rufnummer des eingehend Anrufes, falls diese bekannt ist. 
* Sonst erfolgt ein Hinweis, dass die Rufnummer unbekannt ist. 
*
* @param {String []} pRelationIDs req IDs der Relationen 
* @param {String} pCallAddress req Telefonnummer
*
* @return {void}
*/
function openCallerFrame(pRelationIDs, pCallAddress)
{
    if (pRelationIDs.length > 0)
    {
        var frame = a.valueof("global.cti.open_Frame");
        if (frame == "")
        {		
            var reldata = a.sql("select PERS_ID, RELATIONID from RELATION where RELATIONID in ('" + pRelationIDs.join("', '") + "')", a.SQL_COMPLETE);
            var pers_relids = [];
            var org_relids = [];
            for ( var i = 0; i < reldata.length; i++ )
            {
                if ( reldata[i][0] == "" )  org_relids.push( reldata[i][1] );
                else  pers_relids.push( reldata[i][1] );
            }
            if (pers_relids.length > 0 )  a.openFrame("PERS", "RELATION.RELATIONID in ('" + pers_relids.join("', '") + "')", false, a.FRAMEMODE_TABLE_SELECTION );
            if (org_relids.length > 0 ) 	a.openFrame("ORG", "RELATION.RELATIONID in ('" + org_relids.join("', '") + "')", false, a.FRAMEMODE_TABLE_SELECTION );
        }
        else
        {
            var prompt = [];
            prompt["telefon"] = pCallAddress; 
            a.openFrame(frame, "RELATION.RELATIONID in ('" + pRelationIDs.join("', '") + "')", false, a.FRAMEMODE_SHOW, null, false, prompt);
        }	
    }
    else
    {
        a.localvar("$local.tbTelnumber", pCallAddress);
        a.askUserQuestion(a.translate("Telefonnummer nicht gefunden!"), "DLG_CTI_INCOMING");
    }
}
