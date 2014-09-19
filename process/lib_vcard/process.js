import("lib_user");
import("lib_addr");
import("lib_util");

/*
 * Einlesen einer VCard
 *
 * @return {void}
 */
function importVCard()
{
    var file = new Configuration().getOption("VCard-Directory");

    if ( file != "" ) file += "/";
    file += "*.vcf";
    file = a.askQuestion(a.translate("Datei wählen"), a.QUESTION_FILECHOOSER, [file]);
    if ( file != null )
    {
        var s = a.doClientIntermediate(a.CLIENTCMD_GETDATA, [ file, a.DATA_TEXT ] );
        var reader = new VCardReader(s);
        if(reader)   // wenn hier NULL zurück kommt, wars keine vCard
        {
            var card;
            while( (card = reader.read()) )
            {
                var defaultparams = new Array();
                if (card.ORG ) defaultparams["$comp.orgname"] = card.ORG[0];
                if (card.ADR )
                { 
                    var split = splitAddress(card.ADR[0]["VALUE"][2]); 
                    defaultparams["$comp.address"] = split[0];
                    defaultparams["$comp.buildingno"] = split[1];
                    defaultparams["$comp.zip"] = card.ADR[0]["VALUE"][5];
                    defaultparams["$comp.city"] = card.ADR[0]["VALUE"][3]; 
                    var country = card.ADR[0]["VALUE"][6]
                    if (country != null && country.length > 2 ) 
                    {
                        defaultparams["$comp.country"] = a.sql("select ISO2 from COUNTRYINFO where NAME_DE = '" + country + "'");
                    }
                    else	defaultparams["$comp.country"] = country; 
                }
                if (card.N )
                { 
                    if (card.N[1]) defaultparams["$comp.firstname"] = card.N[1];
                    defaultparams["$comp.lastname"] = card.N[0];
                    if (card.N[3])
                    {
                        var salutation = card.N[3];
                        var regexp =  new RegExp("Herr|Frau", "")
                        var find = salutation.search(regexp);
                        if ( find > -1 )
                        {
                            defaultparams["$comp.salutation"] = salutation.substr( find, 4);
                            defaultparams["$comp.title"] = trim(salutation.substring( find+4 ));
                        }
                        else defaultparams["$comp.title"] = salutation;
                    }
                }
                if (card.TEL)
                {
                    defaultparams["$comp.telefon"] = card.TEL[0]["VALUE"];
                }
                if (card.EMAIL)	defaultparams["$comp.email"] = card.EMAIL[0]["VALUE"]; 
                if (card.TITLE)	defaultparams["$comp.funktion"] = card.TITLE;
                defaultparams["$comp.department"] = "";
                defaultparams["$comp.medium"] = "9";
                defaultparams["$comp.subject"] = a.translate("VCard Import");
                defaultparams["$comp.info"] = "";
		
                var prompts = [];
                prompts["DefaultValues"] = defaultparams;
                a.openFrame("QUICKINSERT", null, false, a.FRAMEMODE_NEW, null, false, prompts);
            // details zum aufbau siehe unten
            }
        }
        else
        {
            a.showMessage(a.translate("Keine VCard-Datei !!"));
        }
    }
}

/*
 * VCard erzeugen
 *
 * @param {String} pRelationID req RelationID 
 *
 * @return {void}
 */
function exportVCard(pRelationID)
{
    var file = new Configuration().getOption("VCard-Directory");

    if ( file != "" ) file += "/";
    file += new AddrObject( pRelationID,"" ).formatAddress( "{on} {fn} {ln}" ) + ".vcf";
    file = a.askQuestion(a.translate("Datei wählen"), a.QUESTION_FILECHOOSER, file.replace(/[^a-zA-Z0-9 _.]/g, ""));
    if ( file != null )
    {
        var vc = new VCardWriter(pRelationID);  
        a.doClientIntermediate(a.CLIENTCMD_STOREDATA, [ file, vc.toString("2.1"), a.DATA_TEXT ] );
    }
}

/*
	Aufbau des card-Objekts:

	das Objekt besitzt eine Eigenschaft mit dem Namen der jeweiligen vCard-eigenschaften:
	
	N     :  [ nachname, vorname, zusatz, ehrentitel ]
	FN    :  full name, formatierter name als string
	ORG   :  [ orgname (evtl. org.einheiten als weitere elemente des arrays) ]
	BDAY  :  geburtstag in der form YYYYMMDD
	CLASS :  string mit klasse (PUBLIC, CONFIDENTIAL, et.c)
	NOTE  :  string mit bemerkung ("\n" (zwei zeichen) steht fuer zeilenumbruch)
	TITLE :  titel 
	ROLE  :  rolle / position
	REV   :  version der vcard, normalerweise string mit zeitstempel
	URL   :  internetadresse als string
	EMAIL :  array aus objekten, jeweils mit eigenschaft VALUE und eigenschaft TYPE
	TEL   :  array aus objekten, jeweils mit eigenschaft VALUE und eigenschaft TYPE
	ADR   :  array aus objekten, jeweils mit eigenschaft VALUE und eigenschaft TYPE

	beispiel fuer einen eintrag bei TEL:
	
	[ { VALUE: "123456", TYPE: ["HOME", "PREF"] }
	, { VALUE: "555-1234", TYPE: ["WORK"] } ]

	als TYPE kann fuer diese Daten HOME, WORK und optional PREF enthalten sein
	fuer die kommunikationsdaten ist der Type auc mit VOICE, BBS, FAX, etc. versehen
	adressdaten (ADR) haben als VALUE ein array aus [ pobox, extaddr, street, locality(city), region, postalcode, country ]
	details im RFC 2426

	== Beispiele fuer den Zugriff:
	nachname = card.N[0];
	vorname = card.N[1];
	titel = card.N[3];
	relfunktion = card.TITLE
	relpos = card.ROLE;	
	address = card.ADR[0]["VALUE"][2]; // achtung ADR kann mehr als ein element besitzen!
	zip = card.ADR[0]["VALUE"][6];
 */

/*
 * VCard erzeugen
 *
 * @param {String} pRelationID req RelationID 
 *
 * @return {void}
 */
function VCardWriter(pRelationID)
{
    var commdata;
    var reldata;
	
    // relationsID fuer die drei moeglichen typen
    var relid = [];

    function makeColArray(pTable)
    {
        var col = a.getColumns(a.getCurrentAlias(), pTable);
        for(var i=0; i < col.length; i++) col[i] = pTable + "." + col[i].toUpperCase(); //kompatibel mit anderen DBs
        return col;
    }
	
    function encodeString(pString, pVersion)
    {
        var s = pString;
        if(pString != undefined) 
        {
            s = s.replace( new RegExp("\,", "g"), "\\,");
            s = s.replace( new RegExp(";", "g"), "\\;");
            if(pVersion == "3.0") s = s.replace( new RegExp("\r\n", "g"), "\\n");
        }
        else
        {
            s = "";
        }
        return s;
    }
	
	
    function encodeQuotedPrintable(pString)
    {
        var result = [];
		
        for(var p=0; p < pString.length; p++)
        {
            var cc = pString.charCodeAt(p);
            if( cc < 32 || cc > 126)
            {
                cc = "0" + cc.toString(16).toUpperCase();
                result.push( "=" + cc );
            }
            else
            {
                result.push( pString[p] );
            }
        }
		
        return result.join("");
    }
	
	
    function processTag(pTag, pVersion)
    {
        var s = [];
        var i;
        var medium;
        var addr;
        var std;
        var lock;
        var type;
        var country;
        var homeaddr;
        var persindex = reldata[2] ? 2 : 3
		
            switch(pTag)
            {
                case "N" :
                    if(reldata[persindex])
                    {
                        s = encodeString(reldata[persindex]["PERS.LASTNAME"], pVersion) + ";" + 
                        encodeString(reldata[persindex]["PERS.FIRSTNAME"], pVersion) + ";" + 
                        ";" + 
                        encodeString(reldata[persindex]["PERS.SALUTATION"], pVersion);
                        if (reldata[persindex]["PERS.TITLE"] != "")
                            s += " " + encodeString(reldata[persindex]["PERS.TITLE"], pVersion);
                        s = [ "N:" + s ];
                    }
                    break;

                case "FN" :
                    if(reldata[persindex])
                    {
                        s = encodeString(reldata[persindex]["PERS.TITLE"], pVersion) + " " + 
                        encodeString(reldata[persindex]["PERS.FIRSTNAME"], pVersion) + " " + 
                        encodeString(reldata[persindex]["PERS.LASTNAME"], pVersion);
                        s = s.replace(/  /g, " ");							
                        s = [ "FN:" + s ];
                    }
                    break;

                case "ORG" :
                    if(reldata[1])
                    {
                        s = reldata[1]["ORG.ORGNAME"];
                        s = encodeString(s, pVersion);
                        s = [ "ORG:" + s ];
                    }
                    break;
					
                case "BDAY" :
                    if(reldata[persindex])
                    {
                        var dob = date.longToDate(reldata[persindex]["PERS.DOB"], "dd.MM.yyyy", "Europe/Berlin");
                        if(s != "") s = [ "BDAY:" + dob ]; else s = [];
                    }
                    break;		
					
                case "CLASS" :
                    s = [ "CLASS:PUBLIC" ];
                    break;
					
                case "NOTE" :
                    if(reldata[persindex])
                    {
                        s = reldata[persindex]["PERS.PERSINFO"];
                        var t = "NOTE";
                        if(pVersion == "2.1") 
                        {
                            t += ";CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE";
                            if(s != "") s = [ t + ":" + encodeQuotedPrintable(s) ]; else s = [];
                        }
                        else 
                        {
                            if(s != "") s = [ t + ":" + encodeString(s, pVersion) ]; else s = [];
                        }
                    }
                    break;
					
                case "TITLE" :
                    if(reldata[3])
                    {
                        s = reldata[3]["RELATION.RELTITLE"];
                        if(s != "") s = [ "TITLE:" + encodeString(s, pVersion) ]; else s = [];
                    }
                    break;
					
                case "REV" :
                    s = date.longToDate(date.date(), "yyyyMMdd HHmmss", "UTC");
                    s = [ "REV:" + s.replace(" ", "T") + "Z" ];
                    break;
					
                case "URL" :
                    for(i=0; i < commdata.length; i++)
                    {
                        medium = commdata[i][2];
                        addr = commdata[i][3];
                        std = commdata[i][4];
                        lock = commdata[i][5];
						
                        if(lock != "Y")
                        {
                            if(medium == "4" || medium == "14")  // homepage
                            {
                                if(medium == "4") type = "URL;TYPE=WORK:";
                                else
                                if(medium == "14") type = "URL;TYPE=HOME:"; 
                                s.push( type + encodeString(addr, pVersion) );
                            }
                        }
                    }
                    break;	
					
                case "EMAIL" :
                    for(i=0; i < commdata.length; i++)
                    {
                        medium = commdata[i][2];
                        addr = commdata[i][3];
                        std = commdata[i][4];
                        lock = commdata[i][5]
                        type = "";
						
                        switch(medium)
                        {
                            case  "3" :
                                type = "EMAIL;WORK;INTERNET";
                                if(std == "1") type += ";PREF";
                                break;
                            case  "6" :
                                type = "EMAIL;WORK;INTERNET";
                                if(std == "1") type += ";PREF";
                                break;
                            case "13" :
                                type = "EMAIL;HOME;INTERNET";
                                if(std == "1") type += ";PREF";
                                break;
                            case "16" :
                                type = "EMAIL;HOME;INTERNET";
                                if(std == "1") type += ";PREF";
                                break;
                        }
						
                        if(type != "" && lock != "Y")
                        {
                            s.push( type + ":" + encodeString(addr, pVersion) );
                        }
                    }
                    break;					

                case "TEL" :
                    for(i=0; i < commdata.length; i++)
                    {
                        medium = commdata[i][2];
                        addr = commdata[i][3];
                        std = commdata[i][4];
                        lock = commdata[i][5];
                        type = "";
						
                        switch(medium)
                        {
                            case "1" :
                                type = "TEL;WORK;VOICE";
                                if(std == "1") type += ";PREF";
                                break;
                            case "2" :
                                type = "TEL;WORK;FAX";
                                if(std == "1") type += ";PREF";
                                break;
                            case "5" :
                                type = "TEL;WORK;CELL";
                                if(std == "1") type += ";PREF";
                                break;
                            case "11":
                                type = "TEL;HOME;VOICE";
                                if(std == "1") type += ";PREF";
                                break;
                            case "12":
                                type = "TEL;HOME;FAX";
                                if(std == "1") type += ";PREF";
                                break;
                            case "15":
                                type = "TEL;HOME;CELL";
                                if(std == "1") type += ";PREF";
                                break;
                        }
						
                        if(type != "" && lock != "Y")
                        {
                            s.push( type + ":" + encodeString(addr, pVersion) );
                        }
                    }
                    break;					
					
                case "ADR" :
                    // home addr
                    if(reldata[2])
                    {
                        country =  a.sql("select NAME_DE from COUNTRYINFO where ISO2 = '" + reldata[2]["ADDRESS.COUNTRY"] + "'");
                        // pobox, extaddr, street, locality, region, zip, country 
                        homeaddr = [ ""
                        , ""
                        , encodeString(reldata[2]["ADDRESS.ADDRESS"], pVersion) + " " + encodeString(reldata[2]["ADDRESS.BUILDINGNO"], pVersion)
                        , encodeString(reldata[2]["ADDRESS.CITY"], pVersion)
                        , encodeString(reldata[2]["ADDRESS.REGION"], pVersion)
                        , encodeString(reldata[2]["ADDRESS.ZIP"], pVersion)
                        , encodeString(country, pVersion) ];
						               
                        s.push( "ADR;HOME:" + homeaddr.join(";"));
                    }
					
                    // work address
                    if(reldata[3])
                    {
                        for(var k in reldata[3])
                        {
                            if(reldata[3][k] == "") reldata[3][k] = reldata[1][k];
                        }
                        country =  a.sql("select NAME_DE from COUNTRYINFO where ISO2 = '" + reldata[3]["ADDRESS.COUNTRY"] + "'");
                        // pobox, extaddr, street, locality, region, zip, country 
                        homeaddr = [ ""
                        , ""
                        , encodeString(reldata[3]["ADDRESS.ADDRESS"], pVersion) + " " + encodeString(reldata[3]["ADDRESS.BUILDINGNO"], pVersion)
                        , encodeString(reldata[3]["ADDRESS.CITY"], pVersion)
                        , encodeString(reldata[3]["ADDRESS.REGION"], pVersion)
                        , encodeString(reldata[3]["ADDRESS.ZIP"], pVersion)
                        , encodeString(country, pVersion) ];
						               
                        s.push( "ADR;WORK:" + homeaddr.join(";"));
                    }
                    break;
			
                default:
                    s = [];
                    break;
            }

        return s;
    }
   	
	
    this.toString = function(pVersion)
    {       
        var tags;
        var i;
        if(pVersion == undefined) pVersion = "3.0";  // default	
		
        if(reldata == null && commdata == null) return "";  // no valid relationid
        if(pVersion != "2.1" && pVersion != "3.0") return ""; // no valid version
		
        var cardlines = [ "BEGIN:VCARD", "VERSION:" + pVersion ];
		
        switch(pVersion)
        {
            case "2.1" :
                tags = [ "N", "FN", "PHOTO", "BDAY", "ADR", "EMAIL", "LABEL", "TEL", "MAILER",
                "TZ", "GEO", "TITLE", "ROLE", "LOGO", "AGENT", "ORG", "NOTE",
                "REV", "SOUND", "UID", "URL", "CLASS", "KEY" ];
                break;
            case "3.0" :
                tags = [ "N", "FN", "PHOTO", "BDAY", "ADR", "EMAIL", "LABEL", "TEL", "MAILER",
                "TZ", "GEO", "TITLE", "ROLE", "LOGO", "AGENT", "ORG", "NOTE",
                "REV", "SOUND", "UID", "URL", "CLASS", "KEY", "NICKNAME", "CATEGORIES", "PRODID", "SORT-STRING" ];
                break;
        }

        for(var t=0; t < tags.length; t++)
        {
            var data = processTag(tags[t].toUpperCase(), pVersion);
            for(i=0; i < data.length; i++) cardlines.push( data[i] );
        }
		
        cardlines.push( "END:VCARD");
		
        var result = "";
		
        // simplest folding algorithm
        var maxlen = 75;
        for(i=0; i < cardlines.length; i++)
        {
            if(cardlines[i].length < maxlen)
            {
                result += cardlines[i] + "\r\n";
            }
            else
            {
                wo = 0;
                var currlen = maxlen;
				
                if(cardlines[i][wo + currlen] == "\\") currlen += 2;
                result += cardlines[i].substr(wo, currlen) + "\r\n";
                wo += currlen;
                while(wo < cardlines[i].length)
                {
                    currlen = maxlen;
                    if(cardlines[i][wo + currlen] == "\\") currlen += 2;
                    result += " " + cardlines[i].substr(wo, currlen) + "\r\n";
                    wo += currlen;
                }
            }
        }

        return result;
		
    }
	
    function getRelationData(pRelationID)
    {
        var data = [null, null, null];
        var werte = a.sql("select org_id, pers_id, 0 from relation where relationid = '" + pRelationID + "'", a.SQL_ROW);
        if(werte[1] == "") wc += " and pers_id = '' or pers_id is null or pers_id = '" + werte[1] + "'";
        var spalten = makeColArray("RELATION");
        spalten = spalten.concat(makeColArray("ORG"), makeColArray("PERS"), makeColArray("ADDRESS") );

        var sql = "";
		
        if( werte[0].replace(/\s+/g,"") == "0") werte[2] = "2";
        else
        if(werte[1] == "") werte[2] = "1"; else
            werte[2] = "3";
    
   	    
            if(werte[2] == "1")
            {
                sql = " select " + spalten.join(",") + ", 1" +
                "   from RELATION " + 
                "   join ADDRESS on (ADDRESSID = ADDRESS_ID) " + 
                "   join ORG on (ORGID = ORG_ID) "  +
                "   left join PERS on (PERSID = PERS_ID) " + 
                "  where pers_id is null and org_id = '" + werte[0] + "' ";
            }
            else if(werte[2] == "2")
            {
                sql = " select " + spalten.join(",") + ", 2" +
                "   from RELATION " + 
                "   join ADDRESS on (ADDRESSID = ADDRESS_ID) " + 
                "   join ORG on (ORGID = ORG_ID) "  +
                "   join PERS on (PERSID = PERS_ID) " + 
                "  where " + trim("RELATION.ORG_ID") + " = '0' and pers_id = '" + werte[1] + "' ";
            } 
            else if(werte[2] == "3")
            {
                sql = " select " + spalten.join(",") +  ", 2" +
                "   from RELATION " + 
                "   join ADDRESS on (ADDRESSID = ADDRESS_ID) " + 
                "   join ORG on (ORGID = ORG_ID) "  +
                "   join PERS on (PERSID = PERS_ID) " + 
                "  where " + trim("RELATION.ORG_ID") + " = '0' and pers_id = '" + werte[1] + "' " + 
                "  union all " +
                " select " + spalten.join(",") +  ", 3" +
                "   from RELATION "  +
                "   join ADDRESS on (ADDRESSID = ADDRESS_ID) " + 
                "   join ORG on (ORGID = ORG_ID) "  +
                "   join PERS on (PERSID = PERS_ID) " + 
                "  where " + trim("RELATION.ORG_ID") + " <> '0' and pers_id = '" + werte[1] + "' and org_id = '" + werte[0] + "' " +
                "  union all " +
                " select " + spalten.join(",") +  ", 1" +
                "   from RELATION "  +
                "   join ADDRESS on (ADDRESSID = ADDRESS_ID) " + 
                "   join ORG on (ORGID = ORG_ID) "  +
                "   left join PERS on (PERSID = PERS_ID) " + 
                "  where org_id = '" + werte[0] + "' and pers_id is null "; 
            }		          


            werte = a.sql(sql, a.SQL_COMPLETE);		
            for(var row=0; row < werte.length; row++)
            {
                var obj = new Object();
                for(var i=0; i < spalten.length; i++)
                {
                    obj[spalten[i]] = werte[row][i];
                }
                data[Number(werte[row][spalten.length])] = obj;
            }

            return data;
        }
	

        if(pRelationID != undefined)
        {
            var ok = a.sql("select relationid from relation where relationid = '" + pRelationID + "'");
		
            if(ok != "")
            {
                reldata = getRelationData(pRelationID);
			
                for(var i=0; i < reldata.length; i++)
                {
                    if(reldata[i] != null)
                    {
                            relid.push( reldata[i]["RELATION.RELATIONID"] );
                        }
                        }
		
                var sql = "select COMMID, RELATION_ID, MEDIUM_ID, ADDR, STANDARD, LOCKFLAG " + 
                "  from comm " + 
                " where relation_id in ('" + relid.join("','") + "')";

                commdata = a.sql(sql, a.SQL_COMPLETE);
            }
            else
            {
                reldata = null;
                commdata = null;
            }
        }

    return this;
}

/*
     * VCard lesen
     * 
     * @param {String} vCardString req 
     *
     * @return {void}
     */
function VCardReader(vCardString)
{
    var _version = "3.0";
    var _isvcard;
    vCardString += "\r\n";
    var _lines = vCardString.split("\r\n");
    var _cards = new Array();
    var _currCard;
    var _readindex = -1;
    var _lineindex = 0;

    var prop;

    while( (prop = getNextProperty()) )
    {
        handleProperty(prop, _version);
    }

    function handleProperty(pProperty)	
    {
        var obj;
		
        // check encoding
        var enc="8BIT";
        var cs="US-ASCII";
        if(pProperty.Version == "2.1")
            for(var i=0; i < pProperty.Param.length; i++)
            {
                var e = pProperty.Param[i].split("=");
                if(e[0].toUpperCase() == "ENCODING") enc = e[1].toUpperCase();
                if(e[0].toUpperCase() == "QUOTED-PRINTABLE") enc = "QUOTED-PRINTABLE";
                if(e[0].toUpperCase() == "CHARSET") cs = e[1];
            }
			
        var pType = pProperty.Name;
        var pContent;
        switch(enc)
        {
            case "8BIT" :
                pContent = pProperty.Value;
                break;
            case "QUOTED-PRINTABLE" :
                pContent = decodeQuotedPrintable(pProperty.Value);
                break;
            case "BASE64" :
                pContent = a.decodeBase64String(pProperty.Value, cs);
                break;
        }
		
        switch(pProperty.Name.toUpperCase())
        {
            case "BEGIN" :
                _currCard = new VCardObject();
                _isvcard = (pProperty.Value == "2.1" || pProperty.Value == "3.0");
                break;
            case "VERSION" :
                _version = pProperty.Value;
                break;
            case "END" :
                _cards.push(_currCard);
                break;
            case "N" :
                _currCard[pType] = pContent.split(";");
                break;
            case "FN":
                _currCard[pType] = pContent;
                break;
            case "VERSION":
                _currCard[pType] = pContent;
                break;
            case "ORG":
                _currCard[pType] = pContent.split(";");
                break;
            case "TITLE":
                _currCard[pType] = pContent;
                break;
            case "ROLE":
                _currCard[pType] = pContent;
                break;					
            case "URL":
                _currCard[pType] = pContent;
                break;					
            case "CATEGORIES":
                _currCard[pType] = vcardsplit(pContent, ";");
                break;
            case "BDAY":
                _currCard[pType] = pContent;
                break;					
            case "TEL":
                if(_currCard[pType] == undefined) _currCard[pType] = new Array();
                obj = new Object();
                obj["TYPE"] = getPropertyParameter(pProperty);
                obj["VALUE"] = pContent;
                _currCard[pType].push(obj);
                break;
            case "EMAIL":
                if(_currCard[pType] == undefined) _currCard[pType] = new Array();
                obj = new Object();
                obj["TYPE"] = getPropertyParameter(pProperty);
                obj["VALUE"] = pContent;
                _currCard[pType].push(obj);
                break;
            case "NOTE" :
                _currCard[pType] = pContent;
                break;
            case "ADR" :
                if(_currCard[pType] == undefined) _currCard[pType] = new Array();
                obj = new Object();
                obj["TYPE"] = getPropertyParameter(pProperty);
                obj["VALUE"] = pContent.split(";");
                _currCard[pType].push(obj);
                break;
            case "PHOTO" :
                log.log(pContent.length);
                break;
        }
		
		
    }
	
    function getPropertyParameter(pProperty)
    {
        var result = pProperty.Param;
        return result;
    }
		
    function getNextProperty()
    {
        if(_lineindex >= _lines.length-1) return null;  // return null, if there are no more lines to read

        // unfold string		
        var s = _lines[_lineindex++];
        while((_lineindex < _lines.length-1) && (_lines[_lineindex][0] == " " || _lines[_lineindex][0] == "\t"))
        {
            s += _lines[_lineindex++];
        }
		
        s = vcardsplit(s, ":");
		
        var prop = vcardsplit(s[0], ";");
        var pg = prop[0].split(".");
		
        var propname;
        var propgroup;
        if(pg.length > 1) 
        {
            propname = pg[1]; 
            propgroup = pg[0];
        }
        else 
        {
            propname = pg[0];
            propgroup = "";
        }
        var propparam = prop.slice(1, prop.length);
        var propvalue = s.slice(1, s.length).join(":");
		
        return {
            Name: propname, 
            Group: propgroup, 
            Param: propparam, 
            Value: propvalue, 
            Version: _version
        };
    }
		
    function vcardsplit(pString, pDelim)
    {
        var wo = [];
        var res = [];
        for(var i=0; i < pString.length; i++)
        {
            if(pString[i] == pDelim && pString[i-1] && pString[i-1] != "\\")
            {
                wo.push(i+1);
            }
        }
		
        if(wo.length > 0)
        {
            wo.unshift(0);
            wo.push(pString.length+1);
			
            var re = new RegExp("\\\\" + pDelim, "g");
			
            for(i=0; i < wo.length-1; i++)
            {
                var tmp = pString.substr(wo[i], wo[i+1]-wo[i]-1);
                tmp = tmp.replace(re, pDelim);
                res.push( tmp );
            }
        }
        else
        {
            res.push( pString );
        }

        return res;
    }

    function unfold(pString)
    {
        var lines = pString.split("\n");
        var wo = lines.length-1;
		
        while(wo >= 0)
        {
            var cc = lines[wo].charCodeAt(0);
            lines[wo] = trim(lines[wo]);
			
            if(cc == 32 || cc == 09)   // unfold here
            {
                lines[wo-1] = lines[wo-1] + lines[wo];
                lines.splice(wo,1);
            }
            wo--;
        }
	
        // trim out blank lines
        wo = lines.length-1;
        while(wo >= 0)
        {
            if(trim(lines[wo]) == "") lines.splice(wo, 1);
            wo--;
        }
		
        return lines;
    }

    function decodeQuotedPrintable(pString)
    {
        var result = "";
		
        var re = new RegExp("=([0-9A-F][0-9A-F])", "g");
        result = pString.replace(re,	function(pMatch, pNumber) 
        {
            return String.fromCharCode("0x" + pNumber);
        } );

        result = result.replace(/=/g, "");
        result = result.replace(/_/g, " ");
		
        return result;
    }

    function trim(str, chars) 
    {
        return ltrim(rtrim(str, chars), chars);
    }
	 
    function ltrim(str, chars) 
    {
        chars = chars || "\\s";
        return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    }
	 
    function rtrim(str, chars) 
    {
        chars = chars || "\\s";
        return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    }
	
    this.isVCardFile = function()
    {
        return _isvcard;
    }		
	
    this.getVersion = function()
    {
        return _version;
    }
	
    this.cardCount = function()
    {
        return _cards.length;
    }
	
    // try to read the next card
    this.read = function()
    {
        _readindex++;

        if(_readindex >= _cards.length)   // overshoot
        {
            return null;
        }
        else
        {
            return _cards[_readindex];
        }
    }
	
    this.getNext = function()
    {
        // skip empty lines
        var prop = getNextProperty();
        while(prop != null && prop.Name == "") prop = getNextProperty();
	
        while((prop = getNextProperty()))
        {
            log.log("propname : " + prop.Name);
            log.log("proparam : " + prop.Param);
            log.log("propvalue: " + prop.Value);
        }
		
        return prop;
    }
	
	
    return this;
}

/*
     * Formatierungsmethoden 

     */
function VCardObject()
{
    // hier kommen später noch formatierungsmethoden rein,
    // die das Objekt gleich passend aufbereiten

    return this;
}
