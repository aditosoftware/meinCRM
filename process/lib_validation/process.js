/*
* Überprüft, ob der übergebene Kommunikationseintrag für das angegebene
* Medium valide ist.
*
* @param {String} pMediumType req das Medium für den Eintrag
* @param {String} pWert req der Kommunikationseintrag
* @param {String} pCountry req der Land
*
* @return {Boolean} true, wenn der Eintrag valide ist, false andernfalls
*/
function doCommValidation(pMediumType, pWert, pCountry ) 
{
    var valid = null;
    
    if (pWert != "" && pMediumType != "" ) 
    {
        switch (pMediumType) 
        {
            case "fon":
            case "fax":
                if ( pCountry == "")  pCountry = a.sql("select COUNTRY from RELATION join EMPLOYEE on RELATIONID = EMPLOYEE.RELATION_ID "
                    + " join ADDRESS on ADDRESSID = ADDRESS_ID and LOGIN = '" + a.valueof("$sys.user") + "'");
                if ( pCountry != "")
                {
                    try
                    {
                        valid = SYSTEM.runPlugin( null, "de.adito.PhoneNumberPlugin.InternationalFormatter", [  pCountry, pWert ])[0];
                        if ( valid == undefined || valid == "" )    valid = null;
                    }
                    catch(ex){
                        log.log(ex);
                    }
                }
                if ( valid == null )    valid = validatePhone( pWert );
                break;
                    
            case "mail":
                valid = validateEmail(pWert);
                break;
            case "www":
                valid = validateWWW(pWert);
                break;
            default:
                valid = pWert;
                break;
        }
    }
    return valid;
}
/*
* konanisches Adressformat für Telefonnummern
*
* @param {String} pNumber req Telefonnummer
* @param {String} pMode req Modus (mail | www)
*
* @return {String}
*/
function showAddressDialog(pNumber, pMode) 
{
    var text = null;
    var part;
	
    switch (pMode) 
    {
        case "mail":
            text = "Bitte geben Sie eine gültige E-Mail-Adresse an."
            break;
        case "www":
            text = "Bitte geben Sie eine gültige Internet-Adresse an."
            break;
    }
	
    if (text != null) 
    {
        var correntInput = false;
        var cancelled = false;

        a.localvar("$local.lblAddress", pNumber);
        a.localvar("$local.txtAddress", pNumber)
		
        part = null;
        switch (pMode) 
        {
            case "mail":
                part = getEmailPart(pNumber);
                break;
            case "www":
                part = getWWWPart(pNumber);
                break;		
        }

        if (part != null) 
        {
            correntInput = true;
            a.localvar("$local.txtAddress", part);
            part = null;
        }

        var ergebnis;
        while(!cancelled && part == null) 
        {
            ergebnis = a.askUserQuestion(a.translate(text), "DLG_CHK_ADDRESS");
            if (ergebnis == null) 
            {
                cancelled = true;
            } 
            else 
            {
                a.localvar("$local.txtAddress", ergebnis["DLG_CHK_ADDRESS.txtAddress"]);
				
                var tmpNumber = ergebnis["DLG_CHK_ADDRESS.txtAddress"];
                part = null;
                switch (pMode) 
                {
                    case "mail":
                        part = getEmailPart(tmpNumber);
                        break;
                    case "www":
                        part = getWWWPart(tmpNumber);
                        break;
                }
            }
        }

        if (ergebnis == null) 
        {
            if (correntInput) 
            {
                return pNumber;
            } 
            else 
            {
                return "";
            }
        } 
        else 
        {
            return part;
        }
    } 
    else 
    {
        a.showMessage("Der Modus '"+pMode+"' wird nicht unterstützt.");
    }
    return "";
}

/*
* Prüft einen String, ob es sich um eine gültige Nummer handelt und fordert den Benutzer 
* ggf. auf eine gültige Nummer einzugeben. 
*
* @param {String} pNumber req Telefonnummer
*
* @return {String} formatierte Telefonnummer
*/
function showPhoneDialog(pNumber) 
{
    var correntInput = false;
    var cancelled = false;
	
    a.localvar("$local.lblCompleteNumber", pNumber);

    var phoneParts = getPhoneParts(pNumber);

    if (phoneParts == null) 
    {
        a.localvar("$local.txtCountryCode", "");
        a.localvar("$local.txtCityCode", "");
        a.localvar("$local.txtPhoneNumber", "");
        a.localvar("$local.txtDirectDial", "");
    } else 
{
        correntInput = true;
        a.localvar("$local.txtCountryCode", phoneParts[0]);
        a.localvar("$local.txtCityCode", phoneParts[1]);
        a.localvar("$local.txtPhoneNumber", phoneParts[2]);
        a.localvar("$local.txtDirectDial", phoneParts[3]);
        phoneParts = null;
    }
	
    var ergebnis;
    // Pflichtfelder abfragen
    while(!cancelled && phoneParts == null) 
    {
        ergebnis = a.askUserQuestion(a.translate("Bitte geben Sie eine gültige Telefonummer an."), "DLG_CHK_PHONE");
        if (ergebnis == null) 
        {
            cancelled = true;
        } else 
{
            a.localvar("$local.txtCountryCode", ergebnis["DLG_CHK_PHONE.txtCountryCode"]);
            a.localvar("$local.txtCityCode", ergebnis["DLG_CHK_PHONE.txtCityCode"]);
            a.localvar("$local.txtPhoneNumber", ergebnis["DLG_CHK_PHONE.txtPhoneNumber"]);  		
            a.localvar("$local.txtDirectDial", ergebnis["DLG_CHK_PHONE.txtDirectDial"]);
			
            phoneParts = new Array(4);
            phoneParts[0] = a.valueof("$local.txtCountryCode");
            phoneParts[1] = a.valueof("$local.txtCityCode");
            phoneParts[2] = a.valueof("$local.txtPhoneNumber");
            phoneParts[3] = a.valueof("$local.txtDirectDial");

            var tmpNumber = formatPhoneParts(phoneParts);
            phoneParts = getPhoneParts(tmpNumber);
        }
    }

    if (ergebnis == null) 
    {
        if (correntInput) 
        {
            return pNumber;
        } else 
{
            return "";
        }
    } else 
{
        return formatPhoneParts(phoneParts);
    }
}

/*
* Zerlegt eine Telefonnummer in ihre einzelnen Bestandteile und liefert diese zurück.
*
* @param {String} pNumber req Telefonnummer
*
* @return {Integer[]} Bestandteile der Telefonnummer (
					[0]=>Landesvorwahl, [1]=>Ortsvorwahl (ohne 0), 
					[2]=>Anschluss, [3]=>Durchwahl )
*/
function getPhoneParts(pNumber) 
{
    var ret = new Array(4);
    pNumber = pNumber.replace("/", "-");
    pNumber = pNumber.replace(".", "-");
    if (pNumber.substring(0, 2) == "00") 
    {
        pNumber = "+" + pNumber.substring(2);
    }
    /* RegEx matcht folgende Ausdrücke
	   +49-221-123-589
	   0221 55698-8
	   +49(221)123-589
	   0221 556988
	   221-654654
	   
	   2  => Landesvorwahl
	   7  => Ortsvorwahl (immer ohne 0)
	   12 => Anschluß
	   17 => Durchwahl
	*/
    var regex = /^\s*((\+\d{1,5})?((\s*\-\s*)|(\s*\()|(\s+)))?0?(\d{2,5})((\s*\-\s*)|(\)\s*)|(\s+))(\d{2,})(((\s*\-\s*)|(\s+))(\d+))?\s*$/;
    var parts = pNumber.match(regex);
	
    if (parts == null) 
    {
        // match nicht erfolgreich
        return null;
    } else 
{
        ret[0] = (parts[2] == null || parts[2] == undefined ? "" : parts[2]);
        ret[1] = (parts[7] == null || parts[7] == undefined ? "" : parts[7]);
        ret[2] = (parts[12] == null || parts[12] == undefined ? "" : parts[12]);
        ret[3] = (parts[17] == null || parts[17] == undefined ? "" : parts[17]);
    }	
    return ret;
}

/*
* Überprüft einen String, ob es sich dabei um eine Email-Adresse handelt und liefert diese dann zurück.
*
* @param {String} pNumber req String, der als gültige Email-Adresse überprüft wird
* 
* @return {String} Email-Adresse oder null, falls der übergeben String keine gültige Email-Adresse war.
*/
function getEmailPart(pNumber) 
{
    var regex = /^\s*(\S{2,}@(\S{2,}\.)+\S{2,5})\s*$/;
    var parts = pNumber.match(regex);
    if (parts == null) 
    {
        return null;
    } else 
{
        return parts[1];
    }	
}

/*
* Überprüft einen String, ob es sich dabei um eine Internet-Adresse handelt und 
* liefert diese dann zurück.
*
* @param {String} pNumber req String, der als gültige Internet-Adresse überprüft wird
*
* @return {String} Internet-Adresse oder null, falls der übergeben String keine gültige Internet-Adresse war.

*/
function getWWWPart(pNumber) 
{
    var regex = /^\s*(((http:\/\/)(ftp:\/\/))?\S+\.[a-z]{2,4})\s*$/;
    var parts = pNumber.match(regex);
    if (parts == null) 
    {
        return null;
    } else 
    {
        return parts[1];
    }	
}

/*
* Formatiert die übergebenen Teile einer Telefonnummer und liefert diese als String zurück.
*
* @param {String[]} pParts req Teile der Telefonnummer
*
* @return {String} Formatierte Telefonnummer
*/
function formatPhoneParts(pParts) 
{
    var ret;
    if (pParts[0] == null || pParts[0] == undefined || pParts[0] == "") 
    {
        var prefix = a.valueof("$global.user_phone");
        if ( prefix != "" && getPhoneParts(prefix) != null ) pParts[0] = getPhoneParts(prefix)[0]; 
        else pParts[0] = "+49";
    }
    if (pParts[1].substring(0, 1) == "0") 
    {
        pParts[1] = pParts[1].substring(1);
    }
    if ( pParts[0] == "+39" ) ret = pParts[0] + " (0" + pParts[1] + ") " + pParts[2];
    else ret = pParts[0] + " (" + pParts[1] + ") " + pParts[2];

    if (pParts[3] != "") 
    {
        ret += " - " + pParts[3];
    }
    return ret;
}

/*
* Validiert eine Telefonnummer auf ihre Gültigkeit.
*
* @param {String} pWert req zu validierender String (Telefonnummer)
*
* @return {String} Gibt eine validierte und formatierte Telefonnummer zurück.
*/
function validatePhone(pWert) 
{
    var phoneParts = getPhoneParts(pWert);
    if (phoneParts == null) 
    {
        pWert = showPhoneDialog(pWert);
    } else 
{
        pWert = formatPhoneParts(phoneParts);
    // Telefonnummer ist gültig -> richtig formatieren
    }
    return pWert;
}

/*
* Validiert eine Email-Adresse auf ihre Gültigkeit.
*
* @param {String} pWert req zu validierender String (Email-Adresse)
* 
* @return {String} Gibt eine validierte und formatierte Email-Adresse zurück.
*/
function validateEmail(pWert) 
{
    var mailPart = getEmailPart(pWert)
    if (mailPart == null) 
    {
        return showAddressDialog(pWert, "mail");
    } else 
{
        return mailPart;
    }
}

/*
* Validiert eine Internet-Adresse auf ihre Gültigkeit.
*
* @param {String} pWert req zu validierender String (Internet-Adresse)
* 
* @return {String} Gibt eine validierte und formatierte Internet-Adresse zurück.
*/
function validateWWW(pWert) 
{
    var wwwPart = getWWWPart(pWert);
    if (wwwPart == null) 
    {
        return showAddressDialog(pWert, "www");
    } else 
{
        return wwwPart;
    }
}
