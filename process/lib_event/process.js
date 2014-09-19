import("lib_relation");
import("lib_grant");

/*
* Fügt Teilnehmer zu einer Veranstaltung hinzu.
*
* @param {String []} pParticipants req Teilnehmer, die zu einer Veranstaltung hinzugefügt werden sollen
* @param {String} pEventID req ID der Veranstaltung
* @param {date} pADate opt Anmeldedatum
* @param {Integer} pPStatus opt Status des Teilnehmners
* @param {Integer} pPFunc opt Funktion der Person in der Veranstaltung
* @param {Integer} pCharge opt Die vom Teilnehmer zu zahlende Gebühr
* @param {Integer} pDiscount opt Rabatt
*
* @return {integer} 
*/
function addParticipantsEvent( pParticipants, pEventID, pCharge, pADate, pPStatus, pPFunc, pDiscount )
{
    if ( pEventID != "" )
    {
        if(pADate == '' || pADate == undefined) pADate = a.valueof("$sys.today");
        if(pPStatus == '' || pPStatus == undefined) pPStatus = 1;
        if(pPFunc == '' || pPFunc == undefined) pPFunc = 3;
        if(pCharge == '' || pCharge == undefined) pCharge = 0;
        if(pDiscount == '' || pDiscount == undefined) pDiscount = 0;

        var count = 0;
        // aktuelle Anzahl - maximale Anzahl
        var iscount = Number(a.sql("select count(*) from eventparticipant where event_id = '" + pEventID + "'"));
        var maxcount = a.sql("select max_participants from event where eventid = '" + pEventID + "'");
        if ( maxcount != "")	maxcount = Number(maxcount); else maxcount = 9999999;
		
        var actdate = a.valueof("$sys.date");
        var user = a.valueof("$sys.user");
        var spalten = new Array("EVENTPARTICIPANTID", "EVENT_ID", "RELATION_ID", "ACCESSDATE", "STATUS", 
            "EPFUNCTION", "CHARGEPART", "DISCOUNTPART", "DATE_NEW", "USER_NEW");
        var typen = a.getColumnTypes("EVENTPARTICIPANT", spalten);

        for ( var i = 0; i < pParticipants.length; i++ )	
        {
            if (getRelationType(pParticipants[i]) != 1) // keine ORG eintragen
            {
                if ( iscount < maxcount )
                {
                    var werte = [ a.getNewUUID(), pEventID, pParticipants[i], pADate, pPStatus, pPFunc, 
                    pCharge, pDiscount, actdate, user ];
                    count += a.sqlInsert("EVENTPARTICIPANT", spalten, typen, werte);
                    iscount++;
                }
                else
                {
                    a.showMessage(a.translate("Die maximale Anzahl Teilnehmer ist erreicht!"));
                    break;
                }
            }
        }
    }
    return count;
}

/*
* löscht Participants
*
* @param {String} pTableName req Tabellenname der Condition
* @param {String} pCondition req Condition
* @param {String} pEventID req ID der Veranstaltung
*
* @return {integer} Anzahl der gelöschten Teilnehmer
*/
function deleteParticipantsWithConditionEvent( pTableName, pCondition, pEventID )
{
    if ( pEventID == undefined ) pEventID = a.valueof("$comp.idcolumn");
    var sqlstr = "select EVENTPARTICIPANTID from RELATION  join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID join EVENTPARTICIPANT on RELATIONID = EVENTPARTICIPANT.RELATION_ID and EVENT_ID = '" + pEventID + "' ";
    switch( pTableName )
    {
        case "PERS":
            sqlstr += " join PERS on RELATION.PERS_ID = PERS.PERSID ";
            break;
        case "DISTLIST":			
            sqlstr += " join DISTLISTMEMBER on DISTLISTMEMBER.RELATION_ID = RELATIONID ";
            break;
    }
    sqlstr += " where "	+ pCondition;
    var relids = a.sql( sqlstr, a.SQL_COLUMN );
    if ( relids.length > 0)
    {
        if ( a.askQuestion( relids.length + " " + a.translate("Teilnehmer entfernen") + " ?", a.QUESTION_YESNO, "") == "true")
        {
            return a.sqlDelete("EVENTPARTICIPANT", "EVENTPARTICIPANTID in (" + sqlstr + ")");
        }
    }
    else a.showMessage( a.translate("Keinen Teilnehmer zum Entfernen"));
    return 0;
}

/*
* Fügt Empfänger zu einer Veranstaltung hinzu.
*
* @param {String} pTableName req Tabellenname der Condition
* @param {String} pCondition req Condition
* @param {String} pEventID req ID der Veranstaltung
* @param {Integer} pCharge opt Die vom Teilnehmer zu zahlende Gebühr
* @param {date} pADate opt Anmeldedatum
* @param {Integer} pPStatus opt Status des Teilnehmners
* @param {Integer} pPFunc opt Funktion der Person in der Veranstaltung
* @param {Integer} pDiscount opt Rabatt
*
* @return {integer} Anzahl der hinzugefügten Teilnehmer
*/
function addParticipantsWithConditionEvent( pTableName, pCondition, pEventID, pCharge, pADate, pPStatus, pPFunc, pDiscount )
{
    if ( pEventID == undefined ) pEventID = chooseEvent();
    var count = 0;
    if ( pEventID != "" )
    {
        var sqlstr = "select RELATIONID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID ";
        switch( pTableName )
        {
            case "PERS":
                sqlstr += " join PERS on RELATION.PERS_ID = PERS.PERSID and RELATION.STATUS = 1 ";
                break;
            case "DISTLIST":			
                sqlstr += " join DISTLISTMEMBER on DISTLISTMEMBER.RELATION_ID = RELATIONID ";
                break;
            case "CAMPAIGN":			
                sqlstr += " join CAMPAIGNPARTICIPANT on CAMPAIGNPARTICIPANT.RELATION_ID = RELATIONID "
                break;				
        }
        sqlstr += " where " + pCondition + " and PERS_ID NOT IN (SELECT PERS_ID FROM EVENTPARTICIPANT join RELATION R on RELATION_ID = R.RELATIONID WHERE EVENT_ID = '" + pEventID + "') "
        +	" and RELATIONID NOT IN (SELECT RELATIONID FROM RELATION where pers_id is null)"; // keine ORG !
        var participants = a.sql( sqlstr, a.SQL_COLUMN );
        if ( participants.length > 0 )
        {
            if (a.askQuestion(participants.length + " " + a.translate("Teilnehmer hinzufügen") + " ?", a.QUESTION_YESNO, "") == "true")
            {
                count =  addParticipantsEvent( participants, pEventID, pCharge, pADate, pPStatus, pPFunc, pDiscount );
            }
        }		
        else a.showMessage( a.translate("Kein Teilnehmer zum Hinzufügen"));
    }
    return count;
}

/*
* setzt die Teilnehmer Bedingungen
*
* @param {String} pPartID req ID des Teilnehmers
*
* @return {String []} der Feldnamen
*/
function setParticipantsCondition( pPartID )
{
    var fieldnames = ["status", "function"];
    var filtervalues;
    var i;
    if (a.hasvar("$image.FilterValues"))
    {
        filtervalues = a.valueofObj("$image.FilterValues");
    }	
    else
    {
        filtervalues = new Object();
        for (i = 0; i < fieldnames.length; i++ ) filtervalues[fieldnames[i]] = "";
    }
		
    for (i = 0; i < fieldnames.length; i++ )
        a.localvar( "$local." + fieldnames[i], filtervalues[fieldnames[i]] );
    a.localvar( "$local.partid", pPartID );

    var res = a.askUserQuestion(a.translate("Bitte Filterbedingungen setzen"), "DLG_PART_FILTER");

    if( res != null && res != undefined && res != "")
    {
        for (i = 0; i < fieldnames.length; i++ )
            filtervalues[fieldnames[i]] = res["DLG_PART_FILTER." + fieldnames[i]];
    }
    a.imagevar("$image.FilterValues", filtervalues );
}

/*
* Generiert den Where-Teil der SQL-Abfrage für Teilnehmer in Abhängigkeit von den Filterfeldern.
*
* @return {String} die Bedingung
*/
function computePartCondition()
{
    if (a.hasvar("$image.FilterValues"))
    {
        var fv = a.valueofObj("$image.FilterValues");
    }
    else
    {
        return "";
    }
    var cond = ""
    cond = makeCondition( fv["status"], cond, "EVENTPARTICIPANT.STATUS = " + fv["status"]);		
    cond = makeCondition( fv["function"], cond, "EVENTPARTICIPANT.EPFUNCTION = " + fv["function"]);
    return cond;
    
    /*
    * Setzt eine Condition zusammen und liefert sie zurück
    *
    * @param {Object} pValue req Filterwert
    * @param {String} pCondition req Variable in welche die Condition zusammengesetzt werden soll
    * @param {String} pWhere opt weitere Bedingung für die Condition
    *
    * @return {String} die zusammengesetzte Condition pCondition
    */
    function makeCondition( pValue, pCondition, pWhere)
    {
        if ( pValue != "" )
        {
            if ( pCondition != "" ) pCondition += " and ";
            pCondition += pWhere;				
        }
        return pCondition;	
    } 
}

/*
* Wählt einen Event aus.
* 
* @return Id des Events
*/
function chooseEvent()
{
    var eventid = "";
    var condition = getGrantCondition("EVENT", "", "", "INSERT");
    if ( condition != "" ) condition = " where " + condition;
    // Sind Selectionen für den User vorhanden ?
    selanz = a.sql ("select count(*) from EVENT " + condition);
    if (selanz  > 0) 
    {
        var antwort = a.askUserQuestion(a.translate("Bitte wählen Sie eine Veranstaltung!"), "DLG_CHOOSE_EVENT");
        if (antwort != null)
        {
            var selection = antwort["DLG_CHOOSE_EVENT.selection"];
            eventid =  a.decodeFirst(selection);
        }
    }
    else a.showMessage(a.translate("Keine Veranstaltung vorhanden!"));
    return eventid;
}

/*
* Gibt die RelationIDs des Events zurück.
*
* @return {String []} mit RelationIDs
*/
function getRelationIDsEvent()
{
    var relids = "";
    var participants =  a.decodeMS(a.valueof("$comp.tbl_participants"));
    // Participants markiert ?		
    if ( participants.length == 0)
    {
        if ( a.askQuestion(a.translate("Möchten Sie alle Teilnehmer verwenden ?"), a.QUESTION_YESNO, "") == "true" )
        {
            var pEventID = a.valueof("$comp.idcolumn");
            var filter = computePartCondition();
            if (filter != '') filter = " and " + filter;
            relids = a.sql("SELECT RELATION_ID FROM EVENTPARTICIPANT join relation on (relationid = relation_id) WHERE EVENT_ID = '" 
                + pEventID + "'" + filter, a.SQL_COLUMN)
        }
        else
        {
            a.showMessage(a.translate("Markieren Sie bitte die Teilnehmer!"));
        }
    }
    else
    {
        relids = a.sql("SELECT RELATION_ID FROM EVENTPARTICIPANT where EVENTPARTICIPANTID in ('" + participants.join("', '") + "')", a.SQL_COLUMN );
    }
	
    return relids;
}