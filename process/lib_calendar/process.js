import("lib_util");
import("lib_frame");

/*
 * Erzeugt und öffnet ein neues Aufgabenobjekt (mit einem Link).
 *
 * @param {String} pSummary opt die Zusammenfassung
 * @param {String} pDescription opt die Beschreibung
 * @param {Boolean} pWithLink opt TRUE legt eine Verknüpfung zu $image.frametable 
 * @param {String[][]} pWithLink opt pWithLink[0]: Name des Frames
 *                							pWithLink[1]: ID des angezeigten Datensatzes
 *                 							pWithLink[2]: Verknüpfungstitel
 * @param {String} pUser opt der Benutzer ( Login )
 * @param {[]} pAffectedUsers opt die betroffenen Benutzer ( Login )
 * @param {date} pStart opt Beginn der Aufagebe
 * @param {date} pDuration opt Dauer

@return {void}
 */
function newTodo( pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration )
{	
    var todo = createEntry( calendar.VTODO, pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration );
    calendar.editEntry(new Array(todo), false);
}

/*
 * Erzeugt eine neue Aufgabe (mit einem Link).
 *
 * @param {String} pSummary opt die Zusammenfassung
 * @param {String} pDescription opt die Beschreibung
 * @param {Boolean} pWithLink opt TRUE legt eine Verknüpfung zu $image.frametable 
 * @param {String[][]} pWithLink opt pWithLink[0]: Name des Frames
 *                							pWithLink[1]: ID des angezeigten Datensatzes
 *               							pWithLink[2]: Verknüpfungstitel
 * @param {String} pUser opt der Benutzer ( Login )
 * @param {[]} pAffectedUsers opt die betroffenen Benutzer ( Login )
 * @param {date} pStart opt Beginn der Aufagebe
 * @param {integer} pGroupType opt ( calendar.GROUP_SINGLE , calendar.GROUP_MULTI )
 * @param {date} pDuration opt Dauer
 *
 * @return {void}
 */

function newSilentTodo( pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration, pGroupType)
{
    if ( pGroupType == undefined ) pGroupType = calendar.GROUP_SINGLE;
    var todo = createEntry( calendar.VTODO, pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration );
    calendar.insert(new Array(todo), pGroupType);
}

/*
 * Erzeugt und öffnet ein neues Terminnobjekt mit einem Link.
 *
 * @param {String} pSummary opt die Zusammenfassung
 * @param {String} pDescription opt die Beschreibung
 * @param {Boolean} pWithLink opt TRUE legt eine Verknüpfung zu $image.frametable 
 * @param {String[][]} pWithLink opt pWithLink[0]: Name des Frames
 *                							pWithLink[1]: ID des angezeigten Datensatzes
 *               							pWithLink[2]: Verknüpfungstitel
 * @param {String} pUser opt der Benutzer ( Login )
 * @param {[]} pAffectedUsers opt die betroffenen Benutzer ( Login )
 * @param {date} pStart opt Beginn der Aufagebe
 * @param {date} pDuration opt Dauer
 *
 * @return {void}
 */
function newEvent( pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration )
{	
    var event = createEntry( calendar.VEVENT, pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration );
    calendar.editEntry(new Array(event), false);
}

/*
 * Erzeugt einen neuen Termineintrag (mit einem Link).
  *
 * @param {String} pSummary opt die Zusammenfassung
 * @param {String} pDescription opt die Beschreibung
 * @param {Boolean} pWithLink opt TRUE legt eine Verknüpfung zu $image.frametable 
 * @param {String[][]} pWithLink opt pWithLink[0]: Name des Frames
 *                							pWithLink[1]: ID des angezeigten Datensatzes
 *                							pWithLink[2]: Verknüpfungstitel
 * @param {String} pUser opt der Benutzer ( Login )
 * @param {[]} pAffectedUsers opt die betroffenen Benutzer ( Login )
 * @param {date} pStart opt Beginn des Termins
 * @param {date} pDuration opt Dauer
 * @param {integer} pGroupType opt ( calendar.GROUP_SINGLE , calendar.GROUP_MULTI )
 * @param {integer} pCategory opt ( calendar.CATEGORIES , encoded(String) z.B.: a.encodeMS(["Service"]) )
 * @param {String} pStatus opt Status des Termins ( TENTATIVE, CONFIRMED, CANCELLED )
 *
 * @return {void}
 */
function newSilentEvent( pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration, pGroupType, pCategory, pStatus)
{	
    if ( pGroupType == undefined ) pGroupType = calendar.GROUP_SINGLE;
    var event = createEntry( calendar.VEVENT, pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration, pCategory, pStatus );
    return calendar.insert( [event] , pGroupType );
}

/*
 * Erzeugt ein neues Aufgaben- / Termin-Objekt (mit einem Link).
 *
 * @param {date} pType req  Augabe oder Termin ( calendar.VTODO, calendar.VEVENT )
 * @param {String} pSummary opt die Zusammenfassung
 * @param {String} pDescription opt die Beschreibung
 * @param {Boolean} pWithLink opt TRUE legt eine Verknüpfung zu $image.frametable 
 * @param {String[][]} pWithLink opt pWithLink[0]: Name des Frames
 *                							pWithLink[1]: ID des angezeigten Datensatzes
 *                							pWithLink[2]: Verknüpfungstitel
 * @param {String} pUser opt der Benutzer ( Login )
 * @param {[]} pAffectedUsers opt die betroffenen Benutzer ( [ Login ] )
 * @param {date} pStart opt Beginn 
 * @param {date} pDuration opt Dauer
 * @param {integer} pCategory opt ( calendar.CATEGORIES , encoded(String) z.B.: a.encodeMS(["Service"]) )
 * @param {String} pStatus opt Status des Termins ( TENTATIVE, CONFIRMED, CANCELLED )
 *
@return {Object} das EntryObjekt
 */
function createEntry( pType, pSummary, pDescription, pWithLink, pUser, pAffectedUsers, pStart, pDuration, pCategory, pStatus )
{
    var Entry = [];
    var framename;
    var framdata;
    var dbid;
    var linktitle;
    if ( pSummary == undefined || pSummary == null  ) pSummary = ""; 			
    if ( pDescription == undefined || pDescription == null ) pDescription = a.getCurrentImageContent(); 			
    if ( pUser == undefined || pUser == null ) pUser = a.valueof("$sys.user"); 			
    if ( pStart == undefined ) pStart = date.dateToLong(date.longToDate(a.valueof("$sys.date"), "dd.MM.yyyy HH:00"), "dd.MM.yyyy HH:mm");
    if ( pCategory == undefined || pCategory == null  ) pCategory = ""; 			

    if (pAffectedUsers == null || pAffectedUsers == undefined )
    {
        Entry[calendar.AFFECTEDUSERS] = "";
    }
    else
    {
        Entry[calendar.AFFECTEDUSERS] = a.encodeMS(calendar.getCalendarUsers(pAffectedUsers));
    }
    Entry[calendar.TYPE] = pType; 
    Entry[calendar.DTSTART] = pStart;
    if ( pType == calendar.VEVENT )
    { 	
        if ( pDuration == undefined ) pDuration = date.ONE_HOUR;
        Entry[calendar.DTEND] = String ( eMath.addInt( pStart, pDuration) );
        if ( pStatus == undefined ) pStatus = calendar.STATUS_CONFIRMED;
    }
    if ( pType == calendar.VTODO )
    { 	
        if ( pDuration != undefined )	Entry[calendar.DUE] = String ( eMath.addInt( pStart, pDuration) );
        else Entry[calendar.DUE] = date.dateToLong(date.longToDate(pStart, "dd.MM.yyyy 23:59"), "dd.MM.yyyy HH:mm");
        if ( pStatus == undefined ) pStatus = calendar.STATUS_NEEDSACTION;
    }
    Entry[calendar.USER] = calendar.getCalendarUser(pUser);
    Entry[calendar.DESCRIPTION] = pDescription;
    Entry[calendar.SUMMARY] = pSummary;
    Entry[calendar.STATUS] = pStatus;
    Entry[calendar.CLASSIFICATION] = calendar.CLASSIFICATION_PUBLIC;
    Entry[calendar.CATEGORIES] = pCategory;

    if (pWithLink == false)
    {
        Entry[calendar.LINKS] = "0";	
    }
    else
    {
        var fd = new FrameData();
        if ( typeof(pWithLink) == "object" )  
        {
            for ( var li = 0; li < pWithLink.length; li++ )
            {
                framename = pWithLink[li][0];
                framdata = fd.getData("name", framename, ["table","idcolumn","title"])[0];			
                dbid = pWithLink[li][1];
                linktitle = framdata[2] + " - " + pWithLink[li][2];

                Entry["LINK_ALIAS_" + ( li + 1 )] = a.valueof("$sys.dbalias");
                Entry["LINK_TABLE_" + ( li + 1 )] = framdata[0];
                Entry["LINK_IDCOLUMN_" + ( li + 1 )] = framdata[1];
                Entry["LINK_DBID_" + ( li + 1 )] = dbid;
                Entry["LINK_FRAME_" + ( li + 1 )] = "comp." + framename;
                Entry["LINK_TITLE_" + ( li + 1 )] = linktitle;
            }
            Entry[calendar.LINKS] = pWithLink.length.toString();				
        }
        else
        {
            if ( pWithLink == true ||  pWithLink == undefined ) 
            {
                framename =  a.valueof("$sys.currentimagename");
                framdata = fd.getData("name", framename, ["table","idcolumn","title"])[0];
                dbid = a.valueof("$comp.idcolumn");
                linktitle = framdata[2] + " - " + a.getCurrentImageContent();
            }			
            Entry[calendar.LINKS] = "1";	
            Entry["LINK_ALIAS_1"] = a.valueof("$sys.dbalias");
            Entry["LINK_TABLE_1"] = framdata[0];
            Entry["LINK_IDCOLUMN_1"] = framdata[1];
            Entry["LINK_DBID_1"] = dbid;
            Entry["LINK_FRAME_1"] = "comp." + framename;
            Entry["LINK_TITLE_1"] = linktitle;
        }
    }
    return Entry;	
}

/*
 * Liefert den Status für die Termine zurück.
 *
 * @return {[]} mit Status der Termine
 */
function get_Event_Status()
{
    return new Array(a.translate("Bestätigt"), a.translate("Vorläufig"), a.translate("Abgesagt"));
}

/*
 * Liefert den Status für die Aufgaben zurück.
 *
 * @return {[]} mit Status der Augaben
 */
function get_ToDo_Status()
{
    return new Array(a.translate("Nicht begonnen"), a.translate("In Bearbeitung"), a.translate("Erledigt"), a.translate("Zurückgestellt"));
}

/*
 * Liefert zum Objekt verknüpfte Aufgaben aus dem Kalender.
 * 
 * @param {String} pFrame req Name des Frames
 * @param {String} pDBID req ID des verknüpften Datensatzes
 * @param {String} pAlias opt
 *
 * @return {[]} mit Aufgaben aus Kalender
 */
function getLinkedToDos (pFrame, pDBID, pAlias )
{
    if (pAlias == undefined ) pAlias = a.valueof("$sys.dbalias");
    var status = " and STATUS in ('NEEDS-ACTION', 'IN-PROCESS')";
    var zustaendig = "";
    var filtervalues = ["", "false"];
    if ( a.hasvar("$image.FilterValuesTE") )
    {
        filtervalues = a.valueofObj("$image.FilterValuesTE");
        zustaendig = filtervalues[0]
        if (filtervalues[1] == "true") status = " and STATUS in ('COMPLETED', 'CANCELLED')";
    }

    var VToDo_Status = get_ToDo_Status();
    var date = getDate(a.valueof("$sys.date"));
    var tab = new Array;

    if (pDBID == "") pDBID = -1;
    var entryids = a.sql("select ENTRYID from ASYS_CALENDARLINK join ASYS_CALENDAR on ENTRYUID = ENTRYID where FRAME = 'comp." + pFrame + "' and ENTRYID is not null " 
        + " and ENTRYTYPE = 2 and DBID = '" + pDBID + "'" + status, pAlias, a.SQL_COLUMN);
    for (var i = 0; i < entryids.length; i++)
    {
        try
        {
            var entry = calendar.getEntry(entryids[i])[0];
            var entr = new Array;
            status = ""; 
            var user = entry[calendar.USER2]["cn"];
            if ((user == zustaendig || zustaendig == ""))
            {
                entr[0] = entry[calendar.ID] 
                var due = getDate(entry[calendar.DUE]);
                if (due < date ) entr[1]	= "-39322"; 
                else 
                {
                    if (due > date) entr[1]	= "-16777216"; else entr[1]	= "-10066177";
                }
                entr[2] = "-1";  // Hintergrundfarbe
                entr[3] = a.decodeMS(entry[calendar.AFFECTEDUSERS]).length;
                entr[4] = entry[calendar.DUE]
                if (entry[calendar.STATUS] == calendar.STATUS_NEEDSACTION) status = VToDo_Status[0];
                else if (entry[calendar.STATUS] == calendar.STATUS_INPROCESS) status = VToDo_Status[1];
                else if (entry[calendar.STATUS] == calendar.STATUS_CANCELLED) status = VToDo_Status[2];
                else if (entry[calendar.STATUS] == calendar.STATUS_COMPLETED) status = VToDo_Status[3];
                entr[5] = status; //Übersetzung von Status 
                entr[6] = entry[calendar.SUMMARY] 
                entr[7] = getRealName([entry[calendar.ORGANIZER2]]);
                entr[8] = getRealName(entry[calendar.ATTENDEES]);
                entr[9] = entry[calendar.DESCRIPTION]
                tab.push(entr);
            } 
        }   
        catch (ex) 
        {
            log.log(ex);
        }
    }
    array_mDimSort(tab, 2, false);
    return tab;
}

/*
 * Liefert zum Objekt verknüpfte Events aus dem Kalender.
 *
 * @param {String} pFrame req Name des Frames
 * @param {String} pDBID req ID des verknüpften Datensatzes
 * @param {String} pAlias req
 *
 * @return {[]} mit Events aus Kalender
 */
function getLinkedEvents (pFrame, pDBID, pAlias )
{
    if (pAlias == undefined ) pAlias = a.valueof("$sys.dbalias");
    var today = a.valueof("$sys.today");
    var date1 = eMath.subDec(today, 7 * a.ONE_DAY);
    var zustaendig = "";
    var filtervalues = ["", "false"];
    if ( a.hasvar("$image.FilterValuesTE"))
    {
        filtervalues = a.valueofObj("$image.FilterValuesTE");
        zustaendig = filtervalues[0]
    }
    var tab = new Array;
    if (pDBID == "") pDBID = -1;
    var entryids = a.sql("select ENTRYID from ASYS_CALENDARLINK join ASYS_CALENDAR on ENTRYUID = ENTRYID where FRAME = 'comp." + pFrame + "' and ENTRYID is not null " 
        + " and ENTRYTYPE = 1 and DBID = '" + pDBID + "' and STATUS in ('CONFIRMED', 'TENTATIVE') and "
        + getTimeCondition("DTSTART", ">=", date1), pAlias, a.SQL_COLUMN);

    for (var i = 0; i < entryids.length; i++)
    {
        try
        {		
            var entry = calendar.getEntry(entryids[i])[0];
            var entr = new Array;
            var start = getDate(entry[calendar.DTSTART]);
            var end = getDate(entry[calendar.DTEND]);
            var user = entry[calendar.USER2]["cn"];

            if ((user == zustaendig || zustaendig == "" ) && start > date1)
            {
                entr[0] = entry[calendar.ID] 
                if (end < today) entr[1]	= "-39322" ;
                else 
                {
                    if (start <= today && end >= today ) entr[1]	= "-10066177" ; else entr[1]	= "-16777216";
                }
                entr[2] = "-1"
                entr[3] = a.decodeMS(entry[calendar.AFFECTEDUSERS]).length;
                entr[4] = entry[calendar.DTSTART]
                entr[5] = entry[calendar.DTEND]
                entr[6] = entry[calendar.SUMMARY] 
                entr[7] = getRealName([entry[calendar.ORGANIZER2]]);
                entr[8] = getRealName(entry[calendar.ATTENDEES]);
                entr[9] = entry[calendar.DESCRIPTION]
                tab.push(entr);
            } 
        }   
        catch (ex) 
        {
            log.log(ex);
        }
    }
    array_mDimSort(tab, 4, false);
    return tab;
}

/*
 * Liefert Aufgaben aus dem Kalender.
 *
 * @param {Object} pFilter req
 *
 * @return {[]} mit allen aufgaben aus dem Kalender
 */
function getTodos( pFilter )
{     
    var today = getDate (a.valueof("$sys.date"));
    var VToDo_Status = get_ToDo_Status();
    var conditions = new Array();
    if ( pFilter == "" )    pFilter =  reset_filterToDo();
    var stati = [];
    if ( pFilter.needs_action == "true" )   stati.push(calendar.STATUS_NEEDSACTION);
    if ( pFilter.in_process == "true" )     stati.push(calendar.STATUS_INPROCESS);
    if ( pFilter.completed == "true")       stati.push(calendar.STATUS_COMPLETED);
    // in LotusNotes gibts  kein STATUS_CANCELLED
    if ( pFilter.cancelled == "true" && calendar.getBackendType() != calendar.BACKEND_DOMINO )   stati.push(calendar.STATUS_CANCELLED);

    // mehrere User als Filter
    var conditioncount = 0;
    if ( typeof( pFilter.user ) != "object" ) users = [trim(pFilter.user)]; else users = pFilter.user;
    for (i = 0; i < users.length; i++ )
        for ( var z = 0; z < stati.length; z++ )
        {
            if ( pFilter.delegated == "true" || users[i] == "")	user = undefined;	else user = users[i];		
            _addCondition(conditions, String(++conditioncount), calendar.VTODO, pFilter.datefrom, pFilter.dateto, user, stati[z]);
        }
    conditions["COUNT"] = String(conditioncount);
    if ( pFilter.delegiert == "true" || typeof(pFilter.user) == "object" )	setAllCalendarGrant();
    // Einträge laden
    var entries = calendar.getEntries(conditions);
    if ( pFilter.delegiert == "true" || typeof(pFilter.user) == "object" )	setCalendarGrant();
    var tab = new Array();
    for (i = 0; i < entries.length; i++)
    {
        var entry = entries[i][0];
        var organizer = entry[calendar.ORGANIZER];

        user = entry[calendar.USER2]["cn"];
        var due = entry[calendar.DUE];
		 			
        if ( due != "" ) due = getDate(due);
        if ( pFilter.delegated == "true" && organizer == a.valueof("$sys.user") && organizer != user || pFilter.delegated != "true"  ) 
        {
            var selected = true;
            if ( pFilter.category != "") selected = hasElement(a.decodeMS(entry[calendar.CATEGORIES]), pFilter.category)
            if ( selected && pFilter.datedue != "") selected = ( due < getDate(pFilter.datedue) );
            if ( selected )
            {
                var status = "";
                var entr = new Array;
                var links =  entry[calendar.LINKS];
                entr[0] = entry[calendar.ID] 
                if (due == today ) entr[1]	= "-10066177" ; 
                else if(due == "") entr[1] = "-13395712";
                else
                {
                    if (due > today ) entr[1]	= "-16777216"; else entr[1]	= "-39322";
                }
                if (entry[calendar.PRIORITY] == "1") entr[2] = "-100";						
                entr[3] = entry[calendar.ATTENDEES].length;
                entr[4] = entry[calendar.DUE]
                if (entry[calendar.STATUS] == calendar.STATUS_NEEDSACTION) status = VToDo_Status[0];
                else if (entry[calendar.STATUS] == calendar.STATUS_INPROCESS) status = VToDo_Status[1];
                else if (entry[calendar.STATUS] == calendar.STATUS_COMPLETED) status = VToDo_Status[2];
                else if (entry[calendar.STATUS] == calendar.STATUS_CANCELLED) status = VToDo_Status[3];
                entr[5] = status;
                entr[6] = entry[calendar.PRIORITY]
                if (entr[6] == "1") entr[6] = a.translate("hoch");
                else if (entr[6] == "5") entr[6] = a.translate("normal");
                else entr[6] = a.translate("niedrig");
                entr[6] = a.translate(entr[6]);	//Übersetzung von Priorität					
                entr[7] = entry[calendar.SUMMARY] 
                entr[8] = getRealName( [ entry[calendar.ORGANIZER2] ] );
                entr[9] = getRealName( entry[calendar.ATTENDEES] );
                if (links == undefined) entr[10] = "";	else entr[10] = links;
                entr[11] = entry[calendar.DESCRIPTION]
                entr[12] = entry[calendar.CREATED];
                tab.push(entr);
            }
        }
    }
    sortArray(tab, -1, 4, 1, 12 );
    return tab;
}

/*
 * Fügt eine Condition hinzu
 *
 * @param {[]} pConditions req die Conditions
 * @param {Integer} pIndex req Index der Condition
 * @param {date} pType req Aufgabe oder Termin (calendar.VTODO, calendar.VEVENT)
 * @param {date} pStart opt Beginn
 * @param {date} pEnd opt Ende
 * @param {String} pUser opt der Benutzer (Login)
 * @param {String} pStatus opt Status der Condition
 *
 * @return {void}
 */
function _addCondition(pConditions, pIndex, pType, pStart, pEnd, pUser, pStatus)
{
    if (pConditions != undefined)
        pConditions["TYPE_"+pIndex] = pType;

    if (pStart != undefined)
        pConditions["START_"+pIndex] = pStart;
 
    if (pEnd != undefined)
        pConditions["END_"+pIndex] = pEnd;
  
    if (pUser != undefined)
        pConditions["USER_"+pIndex] = pUser;

    if (pStatus != undefined)
        pConditions["STATUS_"+pIndex] = pStatus;
}

/*
 * Liefert Events zu bestimmten Usern/Daten in einem Array.
 *
 * @param {Object} pFilter req
 * 
 * @return {[]}
 *				[0] ID
 *				[1] Vordergrundfarbe
 *				[2] ?
 *				[3] Start
 *				[4] Ende
 *				[5] Betreff
 *				[6] Inhalt
 *				[7] User
 *				[8] Anzahl Verknüpfungen
 *				[9] Klassifikation (privat/öffentlich)
 */
function getEvents( pFilter )
{
    if ( pFilter == "" )  pFilter = reset_filterEvent();
    var conditions = new Array();
    var today = getDate(a.valueof("$sys.date"));  
    var conditioncount = 0;   
    var stati = [];
    var user = undefined;
    if ( pFilter.tentative == "true" )    stati.push(calendar.STATUS_TENTATIVE);
    if ( pFilter.confirmed == "true" )    stati.push(calendar.STATUS_CONFIRMED);
    if ( pFilter.cancelled == "true" )    stati.push(calendar.STATUS_CANCELLED);
    if ( pFilter.user != "" )	user = trim(pFilter.user);		

    for ( var z = 0; z < stati.length; z++ )
    {
        _addCondition(conditions, String(++conditioncount), calendar.VEVENT, pFilter.datefrom, pFilter.dateto, user, stati[z]);
    }        
    conditions["COUNT"] = String(conditioncount);
    
    var entries = calendar.getExpandedEntries(conditions, pFilter.datefrom, pFilter.dateto);
    var tab = new Array();
    for ( var i = 0;i < entries.length; i++)
    {
        for (var j = 0; j < entries[i].length; j++)
        {
            var entry = entries[i][j];
            var cat = true;
            if(pFilter.category != "") cat = hasElement(a.decodeMS(entry[calendar.CATEGORIES]), pFilter.category)
            if( cat )
            {
                var status = "";
                var entr = new Array;
                var start = getDate(entry[calendar.DTSTART]);
                var end = getDate(entry[calendar.DTEND]);
                entr[0] = entry[calendar.ID] 
                if (end < today ) entr[1]	="-39322" ;
                else 
                {
                    if (start > today) entr[1]	= "-16777216"; else entr[1]	= "-10066177" ;
                }
                entr[2] = "-1"
                entr[3] = entry[calendar.ATTENDEES].length;
                entr[4] = entry[calendar.DTSTART]
                entr[5] = entry[calendar.DTEND]
                entr[6] = entry[calendar.SUMMARY] 
                entr[7] = getRealName([entry[calendar.ORGANIZER2]]);
                entr[8] = getRealName(entry[calendar.ATTENDEES]);
                if (entry[calendar.STATUS] == "CONFIRMED") status = get_Event_Status()[0];
                else if (entry[calendar.STATUS] == "TENTATIVE") status = get_Event_Status()[1];
                else if (entry[calendar.STATUS] == "CANCELLED") status = get_Event_Status()[2];
                entr[9] = status;
                if (entry[calendar.LINKS] == undefined) entr[10] = ""; 	else entr[10] = entry[calendar.LINKS];
                entr[11] = entry[calendar.DESCRIPTION]
                tab.push( entr );
            }  
        }
    }
    sortArray(tab, -1, 4, 1, 6 );
    return tab;
}
/*
 * Liefert den echten Namen anhand des Logins zurück
 *
 * @param {Array}[]} pUserMap req pUserMap
 *
 * @return 
 */
function getRealName(pUserMap)
{
    var result = [];
    for ( var p = 0; p < pUserMap.length; p++ )
    {
        try
        {
            var userp = tools.getUser( pUserMap[p]["cn"])[tools.PARAMS];
            result.push( userp[tools.FIRSTNAME] + " " + userp[tools.LASTNAME] );
        }
        catch(ex)
        {
            result.push(  pUserMap[p]["cn"] + " " + pUserMap[p]["paramvalue"] );
        }
    }
    return result.join(", \n");
}

/*
 * Liefert das Datum ohne Urzeit zurück
 *
 * @param {String} datetime req DatumZeit
 *
 * @return {date}
 */
function getDate( datetime )
{
    if ( datetime != "")
        return date.dateToLong(date.longToDate(datetime, "dd.MM.yyyy 00:00:00"), "dd.MM.yyyy");
    else return "";
}

/*
 * Setzt den Aufgaben-Filter
 * 
 * @param {Object} pFilter req 
 *
 * @return {image}
 */
function filterToDo( pFilter )
{
    var error = true;
    var von = pFilter.datefrom;
    var bis = pFilter.dateto;
    if ( pFilter == "" )	pFilter =  reset_filterToDo();
    do
    {    
        a.localvar("$local.relation_id", pFilter.user);    
        a.localvar("$local.edt_von", pFilter.datefrom);
        a.localvar("$local.edt_bis", pFilter.dateto);
        a.localvar("$local.category", pFilter.category);
        a.localvar("$local.delegated", pFilter.delegated);
        a.localvar("$local.needs_action", pFilter.needs_action);
        a.localvar("$local.in_process", pFilter.in_process);
        a.localvar("$local.completed", pFilter.completed);
        a.localvar("$local.cancelled", pFilter.cancelled);
        var res = a.askUserQuestion(a.translate("Bitte Filterbedingungen setzen"), "DLG_TASK_FILTER");
        if( res != null )
        {
            pFilter.user =      res["DLG_TASK_FILTER.relation_id"];
            pFilter.datefrom =  res["DLG_TASK_FILTER.edt_von"];
            pFilter.dateto =    res["DLG_TASK_FILTER.edt_bis"];
            pFilter.category =  res["DLG_TASK_FILTER.category"];
            pFilter.delegated = res["DLG_TASK_FILTER.delegated"];
            pFilter.needs_action = res["DLG_TASK_FILTER.needs_action"];
            pFilter.in_process = res["DLG_TASK_FILTER.in_process"];
            pFilter.completed = res["DLG_TASK_FILTER.completed"];
            pFilter.cancelled = res["DLG_TASK_FILTER.cancelled"];
            if (pFilter.datefrom != "" && pFilter.dateto != "" && pFilter.dateto >= pFilter.datefrom ) error = false;
            else a.showMessage(a.translate("Bitte Datumseingabe prüfen!"))
        }
        else 
        {
            pFilter.datefrom = von;
            pFilter.dateto = bis;
            error = false;
        }
    } 
    while ( error )
    return pFilter;
}

/*
* Anzeige des Aufgaben-Filter
* 
* @param {Object} pFilter req 
* 
* @return string Anzeige
*/
function show_filterToDo(pFilter)
{
    var retstring = "";
    var userp = tools.getUser( pFilter.user )[tools.PARAMS];
    if (pFilter.user != "") retstring = a.translate("Aufgaben von") + " " + userp[tools.FIRSTNAME] + " " + userp[tools.LASTNAME];
    if (pFilter.datefrom != "") retstring += ", " + date.longToDate(pFilter.datefrom, "dd.MM.yyyy");
    if (pFilter.dateto != "") retstring += " - " + date.longToDate(pFilter.dateto, "dd.MM.yyyy");
    if (pFilter.category != "") retstring += ", " + a.translate("Kategorie") + " " + pFilter.category;    
    if (pFilter.delegated == "true") retstring += ", " + a.translate("delegiert");
    if (pFilter.needs_action == "true") retstring += ", " + a.translate("Nicht begonnen");    
    if (pFilter.in_process == "true") retstring += ", " + a.translate("In Bearbeitung");
    if (pFilter.completed == "true") retstring += ", " + a.translate("Erledigt");
    if (pFilter.cancelled == "true") retstring += ", " + a.translate("Zurückgestellt");

    return retstring
}

/*
* Setzt den Aufgaben-Filter zurück
*
* @return {filter}
*/
function reset_filterToDo()
{
    var today = getDate (a.valueof("$sys.date"));

    return pFilter =  {
        user: a.valueof("$sys.user"), 
        datefrom: String(eMath.subDec(today, 720 * a.ONE_DAY)), 
        dateto: String(eMath.addDec(today, 3 * a.ONE_DAY)), 
        datedue: "",
        category: "",
        delegated: "", 
        needs_action: "true",
        in_process: "true",
        completed: "",
        cancelled: ""
    };
}

/*
* Setzt den Event-Filter
* 
* @param {Object} pFilter req 
*
* @return {image}
*/
function filterEvent( pFilter )
{
    var error = true;
    var von = pFilter.datefrom;
    var bis = pFilter.dateto;
    if ( pFilter == "" )	pFilter =  reset_filterEvent();
    do
    {        
        a.localvar("$local.relation_id", pFilter.user);
        a.localvar("$local.edt_von", pFilter.datefrom);
        a.localvar("$local.edt_bis", pFilter.dateto);
        a.localvar("$local.category", pFilter.category);
        a.localvar("$local.tentative", pFilter.tentative);
        a.localvar("$local.confirmed", pFilter.confirmed);
        a.localvar("$local.cancelled", pFilter.cancelled);
        var res = a.askUserQuestion(a.translate("Bitte Filterbedingungen setzen"), "DLG_EVENT_FILTER");
        if( res != null )
        {
            pFilter.user =      res["DLG_EVENT_FILTER.relation_id"];
            pFilter.datefrom =  res["DLG_EVENT_FILTER.edt_von"];
            pFilter.dateto =    res["DLG_EVENT_FILTER.edt_bis"];
            pFilter.category =  res["DLG_EVENT_FILTER.category"];
            pFilter.tentative = res["DLG_EVENT_FILTER.tentative"];
            pFilter.confirmed = res["DLG_EVENT_FILTER.confirmed"];
            pFilter.cancelled = res["DLG_EVENT_FILTER.cancelled"];
            if (pFilter.datefrom != "" && pFilter.dateto != "" && pFilter.dateto >= pFilter.datefrom ) error = false;
            else a.showMessage(a.translate("Bitte Datumseingabe prüfen!"))
        }
        else 
        {
            pFilter.datefrom = von;
            pFilter.dateto = bis;
            error = false;
        } 
    } 
    while ( error )
    return pFilter;
}

/*
* Anzeige des Event-Filter
* 
* @param {Object} pFilter req 
* 
* @return string Anzeige
*/
function show_filterEvent(pFilter)
{
    var retstring = "";
    
    var userp = tools.getUser( pFilter.user )[tools.PARAMS];
    if (pFilter.user != "") retstring = a.translate("Termine von") + " " + userp[tools.FIRSTNAME] + " " + userp[tools.LASTNAME];
    if (pFilter.datefrom != "") retstring += ", " + date.longToDate(pFilter.datefrom, "dd.MM.yyyy");
    if (pFilter.dateto != "") retstring += " - " + date.longToDate(pFilter.dateto, "dd.MM.yyyy");
    if (pFilter.category == "true") retstring += ", " + a.translate("Kategorie") + " " + pFilter.category;
    if (pFilter.tentative == "true") retstring += ", " + a.translate("Vorläufig");
    if (pFilter.confirmed == "true") retstring += ", " + a.translate("Bestätigt");
    if (pFilter.cancelled == "true") retstring += ", " + a.translate("Abgesagt");

    return retstring
}

/*
* Setzt den Event-Filter zurück
*
* @return {filter}
*/
function reset_filterEvent()
{
    var today = getDate (a.valueof("$sys.date"));

    return pFilter =  {
        user: a.valueof("$sys.user"), 
        datefrom: String(eMath.subDec(today, 7 * a.ONE_DAY)), 
        dateto: String(eMath.addDec(today, 7 * a.ONE_DAY)), 
        category: "",
        tentative: "",
        confirmed: "true",
        cancelled: ""
    };
}

/*
* Setzt den Aufgabe/Event-Filter in Tab Aufgaben/Termine
*
* @return {image}
*/
function filterLinkedToDo_Event()
{
    var filtervalues = ["", "false"];

    var res = a.askUserQuestion(a.translate("Bitte Filterbedingungen setzen"), "DLG_TASK_DATE_LINKED_FILTER");

    if( res != null && res != undefined && res != "")
    {
        filtervalues[0] = res["DLG_TASK_DATE_LINKED_FILTER.relation_id"]
        filtervalues[1] = res["DLG_TASK_DATE_LINKED_FILTER.done"]
    }
    a.imagevar("$image.FilterValuesTE", filtervalues );
    a.refresh("$comp.tbl_Aufgabe");
}

/*
* Setzt den Aufgabe/Event-Filter zurück
*
* @return {image}
*/
function resetfilterLinkedToDo_Event()
{
    var filtervalues = ["", "false"];

    a.imagevar("$image.FilterValuesTE", filtervalues );
    a.refresh("$comp.tbl_Aufgabe");
}

/*
* setzt die Kalenderrechte
*
* @return {void}
*/
function setCalendarGrant()
{
    try
    {
        //********** Kalender-Rechte vergeben **********
		
        // Rechte zurücksetzen
        calendar.resetCalendarUser();
		
        // Lese- und Schreibrechte auf Kalender aus Datentabelle holen
        var calendar_user = a.sql("select calendar_read, calendar_write from employee where login = '" + a.valueof("$sys.user") + "'", a.SQL_ROW);
        var calendar_user_read = a.decodeMS(calendar_user[0]);
        var calendar_user_write = a.decodeMS(calendar_user[1]);
		
        //wenn keine anderen Kalenderrechte vorhanden sind, müsssen die eigene Kalenderrechte explizit gesetzt werden
        if(calendar_user_read.length == 0) calendar_user_read = [a.valueof("$sys.user")];
        if(calendar_user_write.length == 0) calendar_user_write = [a.valueof("$sys.user")];

        //Kalenderrechte inkl. Sortierung setzen
        if (calendar_user_read.length > 0)
            calendar.setCalendarUser(calendar_user_read, calendar.RIGHT_READ, true, calendar.SORTSTRATEGY_NATURAL );
		
        if (calendar_user_write.length > 0)
        {
            //Admin User darf immer auch schreibend zugreifen
            calendar_user_write = calendar_user_write.concat(["Admin"]);
			
            calendar.setCalendarUser(calendar_user_write, calendar.RIGHT_WRITE, true, calendar.SORTSTRATEGY_NATURAL );
        }	
        //********** Ressourcen in Kalender einfügen ************
        var ressource = tools.getUsersWithRole("PROJECT_Ressource");
        calendar.setCalendarUser(  ressource, calendar.RIGHT_WRITE | calendar.RIGHT_READ  );
    }
    catch(ex)
    {
        log.log(ex, log.INFO, a.translate("Fehler beim Setzen der Kalenderrechte!"), true, true);
    }
}

/*
* setzt Recht für alle Kalender
*
* @return {void}
*/
function setAllCalendarGrant()
{
    // Rechte zurücksetzen
    calendar.resetCalendarUser();
    var user = tools.getStoredUsers();
    var calendar_user = []; 
    for ( var i = 0; i < user.length; i++ )
    {
        calendar_user.push(user[i][1]); 
    }
    calendar.setCalendarUser(calendar_user, calendar.RIGHT_READ | calendar.RIGHT_WRITE, false, calendar.SORTSTRATEGY_NATURAL );
}

/*
* gibt die Logins der user, die den übergebenen User als Attribute eingetragen haben, zurück
* 
* @param {[]} pUsers req Logins
* @param {String []} pAttrName req AttributeName für Employee
* @param {String []} pFields opt
*
* @return {String []} Logins
*/
function getUsersbyAttr( pUsers, pAttrName, pFields )
{
    if (typeof(pAttrName) == "string") pAttrName = [pAttrName]
    var sqltype = a.SQL_COMPLETE;
    if ( pFields == undefined )  
    {
        pFields = ["LOGIN"];
        sqltype = a.SQL_COLUMN;
    }
    if(pFields.length == 1) sqltype = a.SQL_COLUMN;
    var sqlstr = "select " + pFields.join(", ") + " from ATTRLINK join ATTR on ATTRLINK.ATTR_ID = ATTRID and OBJECT_ID = 12 "
    + "and ATTRNAME in ('" + pAttrName.join("','") + "') "
    + " join EMPLOYEE on EMPLOYEEID = ATTRLINK.ROW_ID join RELATION on RELATION_ID = RELATIONID join PERS on PERS_ID = PERSID"
    + " where VALUE_ID in (select EMPLOYEEID from EMPLOYEE where LOGIN in ('" + pUsers.join("','") + "'))"
    return a.sql( sqlstr, sqltype);
}

/*
* Gibt die Anzahl der verknüpften Aufgaben und Termine zurück.
*
* @param {String} pID req
* @param {String} pFrame req 
*
* @return {String} text
*/
function countLinkedTodoEvent(pID, pFrame)
{
    var today = date1 = eMath.subDec(a.valueof("$sys.today"), 7 * a.ONE_DAY);
    var str = "select count(*) from ASYS_CALENDARLINK join ASYS_CALENDAR on ENTRYUID = ASYS_CALENDARLINK.ENTRYID "
    + " where FRAME = 'comp." + pFrame + "' and ENTRYUID is not null and DBID = '" + pID + "'";
    var rettask = a.sql(str + "and ENTRYTYPE = 2 and STATUS in ('NEEDS-ACTION', 'IN-PROCESS')");
    var retevent = a.sql(str + " and ENTRYTYPE = 1 and STATUS in ('CONFIRMED', 'TENTATIVE') and " + getTimeCondition("DTSTART", ">=", today));
    a.rs(a.translate("&Aufg / Term (%0/%1)", [rettask, retevent]));
}

/*
* Gibt die Anzahl der verknüpften Aufgaben zurück.
*
* @param {String} pID req
* @param {String} pFrame req 
*
* @return {String} text
*/
function countLinkedTodo(pID, pFrame)
{
    var str = "select count(*) from ASYS_CALENDARLINK join ASYS_CALENDAR on ENTRYUID = ASYS_CALENDARLINK.ENTRYID "
    + " where FRAME = 'comp." + pFrame + "' and ENTRYUID is not null and DBID = '" + pID + "'";
    var rettask = a.sql(str + "and ENTRYTYPE = 2 and STATUS in ('NEEDS-ACTION', 'IN-PROCESS')");
    a.rs(a.translate("&Aufgaben(%0)", [rettask]));
}

/*
* Gibt die Überschneidungen von Termine zurück.
*
* @param {Date} pStart req
* @param {Date} pEnd req 
* @param {Array} pUsers req 
*
* @return {String Array} Termine
*/
function getOverlappingEvents(pStart, pEnd, pUsers  )
{
    var result = new Array();
    var users = pUsers;
    if (calendar.getBackendType() == calendar.BACKEND_DB && pStart != "" && pEnd != "" && users.length > 0)
    {  
        calendar.clearCache();
        for (var u = 0; u < users.length; u++)
        {
            var localuid = a.valueofObj("$image.entry")[calendar.ID]
            var condition = new Array();
            condition["COUNT"] = "1";
            condition["TYPE_1"] = calendar.VFREEBUSY;
            condition["USER_1"] = users[u][0];
            condition["START_1"] = pStart;
            condition["END_1"] = pEnd;
		
            var fbsall = calendar.getEntries(condition);
            for (var j = 0; j < fbsall.length; j++)
            {		
                var fbs = fbsall[j];
                for (var i = 0; i < fbs.length; i++)
                {
                    var next = fbs[i];
                    var uid = next[calendar.ID];
                    var sum = next[calendar.SUMMARY];	
                    if (uid != localuid)
                    {		
                        var freebusy = next[calendar.FREEBUSY];
                        var freebusyDec = a.decodeMS(freebusy);
                        var match = false;
                        for (var k = 0; k < freebusyDec.length; k++)
                        {
                            var freebusyInstance = a.decodeMS(freebusyDec[k]);
                            if (!freebusyInstance[0].equals("FREE"))
                            {
                                match = true;			 								
                            }
                        }					
                        if (match)  result.push([users[u][2], sum != null && sum.length > 0 ? sum : "?", uid]);
                    }	  						
                }
            }
        }
    }
    return result;
}

 