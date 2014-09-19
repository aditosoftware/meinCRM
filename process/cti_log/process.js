import("lib_relation");
import("lib_keyword");
import("lib_validation");
import("lib_history");
import("lib_telephony");
import("lib_addr");

var logging = false;   // Logging ein/aus
var callAddress = a.valueof("$local.callAddress");
var callisincoming = a.valueof("$local.callIsIncoming") == "true";
var callstate = a.valueof("$local.callState");
var callid = a.valueof("$local.callID");
var connected = false;
var relids = ""; 
//  Es wird das CTILog (Anrufliste) geschrieben
var ctilog = ( a.valueof("$global.cti_log") == "true");  
// Es wird eine neue Historie angelegt
var newHistory = ( a.valueof("$global.cti_newhistory") == "true");    
// Internen Anruf ignorieren
var ignoreInterncall = a.valueof("$global.cti.ignoreinterncall") == "true";
var leadingnumber;
var mode;
var spalten;
var typen;
var ctilogid;

// Für Tapi-Treiber mit privateData
if ( a.hasvar("$local.privateData2") )
{
    var privatedata = a.valueofObj("$local.privateData2");
    var callernumber =  privatedata["callerNumber"];
    var callednumber =  privatedata["calledNumber"];
    var connectednumber =  privatedata["connectedNumber"];
    if ( callisincoming )	callAddress = callernumber;
    else callAddress = callednumber;
    if ( connectednumber != "" ) 
    {
        connected = true;
        callAddress = connectednumber;
    }
}
// Interner Anruf ?   keine führende 0 und nicht länger als 3 Steellen
var intern = callAddress.search(/^0/) == -1 && callAddress.length <= 3;
if ( intern )
{
    // Telefonnumer des eingeloggten Users
    var user_phone = a.valueof("$global.user_phone");
    callAddress = user_phone.substr(0, user_phone.length - callAddress.length) + callAddress;
}
else
{
    if ( callisincoming ) leadingnumber = a.valueof("$global.cti_inlineleadingnumber") == "true";
    else leadingnumber = a.valueof("$global.cti_outlineleadingnumber") == "true";
    if ( leadingnumber )	callAddress = callAddress.replace(new RegExp("^" + a.valueof("$sys.outsidelineaccess")), "");
}
if ( logging )	log_callstate();
// *********** Ringing **********************
if( !connected && (callstate == telephony.CALLSTATE_RINGING || callstate == telephony.CALLSTATE_CONNECTION_RINGING) )
{
    relids = getRelIDsfromCall( callAddress.replace(/^\+|^0+|\s/g,"") );
    if ( ctilog )// insert 
    {
        if ( callisincoming )	mode = "0"; // eingehend 
        else 	mode = "2"; // ausgehend
        spalten = ["CTILOGID", "CALLID", "ADDRESS", "ANSWERMODE", "RELATION_ID", "DATE_NEW", "USER_NEW"];
        typen = a.getColumnTypes( "CTILOG", spalten);
        var werte = [ a.getNewUUID(), callid, callAddress, mode, relids[0], date.date(), a.valueof("$sys.user")];
        a.sqlInsert("CTILOG", spalten, typen, werte);
    }
    // Frame öffnen nur bei externen Anruf
    if (callisincoming && ( !intern || !ignoreInterncall ))	openTelPopup(relids, callAddress);	
}
// *********** Talking **********************
if(callstate == telephony.CALLSTATE_TALKING)
{
    if ( ctilog ) // update	
    {
        ctilogid = a.sql("select CTILOGID from CTILOG where CALLID = '" + callid + "' order by DATE_NEW desc");
        spalten = ["ANSWERMODE"];
        typen = a.getColumnTypes( "CTILOG", spalten);
        a.sqlUpdate("CTILOG", spalten, typen, [ callisincoming ? "1" : "4" ], "CTILOGID = '" + ctilogid + "'");
    }
    // neue Historieneintrag
    if ( newHistory  && !intern )
    {	
        relids = getRelIDsfromCall( callAddress.replace(/^\+|^0+|\s/g,"") );
        if (relids.length > 0 )		InsertHistory( relids, "Telefon", callisincoming ? "i" : "o" );
    }
}
// *********** Disconnected **********************
if(callstate == telephony.CALLSTATE_DISCONNECTED)
{
    if ( ctilog ) // update	
    {
        ctilogid = a.sql("select CTILOGID from CTILOG where CALLID = '" + callid + "' order by DATE_NEW desc");
        spalten = ["DATE_EDIT"];
        typen = a.getColumnTypes( "CTILOG", spalten);
        a.sqlUpdate("CTILOG", spalten, typen, [ a.valueof("$sys.date") ], "CTILOGID = '" + ctilogid + "'");
    }
}

/*
* ausgabe der Parameter 
*
* @return {void}
*/
function log_callstate()
{
    var callstatename = ""
    switch( parseInt(callstate) )
    {
        case telephony.CALLSTATE_RINGING:
            callstatename = "CALLSTATE_RINGING"
            break;
        case telephony.CALLSTATE_CONNECTION_RINGING:
            callstatename = "CONNECTION_RINGING"
            break;
        case telephony.CALLSTATE_TALKING:
            callstatename = "CALLSTATE_TALKING"
            break;
        case telephony.CALLSTATE_CONNECTING:
            callstatename = "CALLSTATE_CONNECTING"
            break;
        case telephony.CALLSTATE_BUSY:
            callstatename = "CALLSTATE_BUSY"
            break;
        case telephony.CALLSTATE_CREATED:
            callstatename = "CALLSTATE_CREATED"
            break;
        case telephony.CALLSTATE_DISCONNECTED:
            callstatename = "CALLSTATE_DISCONNECTED"
            break;
        case telephony.CALLSTATE_ON_HOLD:
            callstatename = "CALLSTATE_ON_HOLD"
            break;
        case telephony.CALLSTATE_UNKNOWN:
            callstatename = "CALLSTATE_UNKNOWN"
            break;
    }
    log.log( "********* callState: " + callstatename + " Intern: " + intern );
    log.log( " callAddress: " + callAddress + " / callisincoming: " + callisincoming  + " / callid: " + callid );
    var message = "";
    for ( var map in privatedata)   message += map + ": " + privatedata[map] + " / ";
    log.log( " pdatamap: " + message )
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
function openTelPopup(pRelationIDs, pCallAddress)
{
    var prompt = [];
    prompt["telefon"] = pCallAddress;
    if (pRelationIDs.length > 0)
    {
        prompt["RELATIONID"] = pRelationIDs
        prompt["address"] = new AddrObject( pRelationIDs[0] ).formatAddress();
    }
    else
    {
        prompt["RELATIONID"] = [];
        prompt["address"] = a.translate("Anrufer nicht identifizierbar");
    }
    a.openFrame("TELPOPUP", "", a.WINDOW_NOTIFY, a.FRAMEMODE_SEARCH, ["230", "170", a.WINDOWPOSITION_BOTTOM_RIGHT], false, prompt);
}
