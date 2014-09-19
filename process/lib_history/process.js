import("lib_sql");
import("lib_attr");
import("lib_keyword");
import("lib_grant");
import("lib_relation");
import("lib_themetree");

/*
* Gibt SQL-String für die HistoryLinkAnzeige zurück.
*
* @param {String} pObjectID req ID des verknüpften Frames
* @param {String} pROWID req ID des verknüpften Datensatzes
*
* @return {String} SQLString
*/
function GetLinkFields( pObjectID, pROWID)
{
	
    var sqlstr = "";
    switch (pObjectID)
    {
        case '1':  // ORG
            sqlstr = "select orgname from org join relation on (org.orgid = relation.org_id) where relationid = " + pROWID;
            break;
        case '2':  // Pers
            sqlstr = "select " + concat(["firstname", "lastname"]) + " from relation "
            + " join pers on (pers.persid = relation.pers_id) where relationid = " + pROWID;
            break;
        case '3':  // Funktion
            sqlstr = "select " + concat(["firstname", "lastname", "','", "orgname"]) 
            + " from relation join org on (org.orgid = relation.org_id)"
            + " join pers on (pers.persid = relation.pers_id) where relationid = " + pROWID;
            break;
        case '4':  // History
            sqlstr = "select SUBJECT from HISTORY where HISTORYID = " + pROWID;
            break;
        case '5':  // DISTLIST
            sqlstr = "select name from distlist where distlistid = " + pROWID;
            break;
        case '6':  // CAMPAIGN
            sqlstr = "select name from campaign where campaignid = " + pROWID;
            break;
        case '13':  // COMPLAINT
            sqlstr = "select " + concat([ cast("COMPLAINTNUMBER", "varchar", 10), "':'", cast("SUBJECT", "varchar", 50) ]) + " from COMPLAINT where COMPLAINTID = " + pROWID;
            break;
        case '16':  // SALESPROJECT
            sqlstr = "select " + concat([ cast("PROJECTNUMBER", "varchar", 10), "':'", cast("PROJECTTITLE", "varchar", 50) ]) + " from SALESPROJECT where SALESPROJECTID = " + pROWID;
            break;
        case '18':  // BULKMAIL_DEFINITION
            sqlstr = "select MAILINGNAME from BULKMAILDEF where BULKMAILDEFID = " + pROWID;
            break;
        case '31':  // EVENT
            sqlstr = "select " + concat([ cast("EVENTNUMBER", "varchar", 10), "':'", cast("TITLE", "varchar", 50) ]) + " from EVENT where EVENTID = " + pROWID;
            break;
        case '50':  // PROPERTY
            sqlstr = "select " + concat([ cast("PROPERTYNUMBER", "varchar", 10), "':'", cast("TITLE", "varchar", 50) ]) + " from PROPERTY where PROPERTYID = " + pROWID;
            break;
        case '33':  // CONTRACT
            sqlstr = "select " + concat([ cast("CONTRACTCODE", "varchar", 10), getKeySQL("CONTRACTTYPE", "CONTRACTTYPE" ) ]) + " from CONTRACT where CONTRACTID = " + pROWID;
             break;
        case '51':  // MACHINE
            sqlstr = "select " + concat([ cast("PRODUCTNAME", "varchar", 10), "':'", cast("SERIALNUMBER", "varchar", 50) ]) 
            + " from MACHINE join PRODUCT on PRODUCTID = PRODUCT_ID where MACHINEID = " + pROWID;
            break;
        case '52':  // SERVICEORDER
            sqlstr = "select " + concat([ cast("SERVICEORDERCODE", "varchar", 10), getKeySQL("SERVICESTATUS", "SERVICESTATUS" ) ]) + " from SERVICEORDER where SERVICEORDERID = " + pROWID;
            break;
        default:
            sqlstr = "'Noch nicht definiert !'";
            break;
    }
    return sqlstr;
}

/*
* Gibt SQL-String zum Füllen der History zurück.
*
* @param {Array} pRowIDs req in HISTORYLINK
* @param {Array} pObjectIDs req in HISTORYLINK
* @param {Integer} pCondition req Condition 
*
* @return {String} SQLString  
*/
function HistoryTable(pRowIDs, pObjectIDs, pCondition)
{
    var condition = "where OBJECT_ID in ( " + pObjectIDs.join() + ") and HISTORYLINK.ROW_ID in ('" + pRowIDs.join("','") +  "')";
    if(pCondition != "") condition += " and " + pCondition; 
   
    // Begrenzung der Datensatzanzahl in History
    var user = tools.getUser(a.valueof("$sys.user"))
    var dslimit = user[tools.PARAMS]["dslimit"]; 
    if ( dslimit == undefined ) dslimit = 500;
			 
    var data = a.sql("select HISTORYID, case when HISTORY.HISTORY_ID is null then MEDIUM else 999 end, ENTRYDATE, "
    + concat([getKeySQL( "HistoryMedium", "MEDIUM" ), " case when DIRECTION = 'o' then '>' else '<' end "]) 
    + ", SUBJECT, " + concat(["LASTNAME", "FIRSTNAME"]) + ", '', INFO "
    + " from HISTORY join HISTORYLINK on HISTORY.HISTORYID = HISTORYLINK.HISTORY_ID " 						
    + " left join RELATION on RELATION.RELATIONID = HISTORY.RELATION_ID left join PERS on PERS.PERSID = RELATION.PERS_ID "
    + condition + " order by entrydate desc", a.SQL_COMPLETE, dslimit);
    
    // Themen mit einfügen
    var themekey = [];
    var theme = a.sql("select HISTORYID, THEME_ID "
                + " from HISTORY join HISTORYLINK on HISTORY.HISTORYID = HISTORYLINK.HISTORY_ID "
                + " join HISTORY_THEME on HISTORY_THEME.HISTORY_ID = HISTORY.HISTORYID "
                + condition + " group by HISTORYID, THEME_ID", a.SQL_COMPLETE);
        
    for (var i = 0; i < theme.length; i++)
    {
        if ( themekey[theme[i][0]] == undefined )   themekey[theme[i][0]] = [];
        themekey[theme[i][0]].push(getThema( theme[i][1] ));
    }
    for(i = 0; i< data.length; i++)
    {
        if ( themekey[data[i][0]] != undefined )    data[i][6] = themekey[data[i][0]].join("\n")
    }       
    return data;
}
/*
* gibt an ob Historien Bedingungen gesetzt ist
*
* @return {boolean}
*/
function isHistoryCondition()
{
    if (a.hasvar("$image.FilterValues"))
    {
        var filtervalues = a.valueofObj("$image.FilterValues");
    }
    else
    {
        return false;
    }
    for ( fieldname in filtervalues )
        if (filtervalues[fieldname] != "") return true;
    return false;
}

/*
* gibt die LabelBeschriftung zurück
* 
* @param {String} pMessage opt Gibt an wessen Historie es ist
*
* @return {String}
*/
function setLabelHistoryCondition( pMessage )
{
    var message = a.translate("Historie");
    if ( pMessage != undefined && pMessage != "" )	message += " " + a.translate("von") + " " + pMessage;  
    if( isHistoryCondition() )	
        message += " " + a.translate("(mit Filter)");
    else
        message = a.translate("Gesamte") + " " + message;
    return message;
}

/*
* setzt die Historien Bedingungen zurück
*
* @return {Object} filtervalues
*/
function resetHistoryCondition()
{
    var filtervalues = a.valueofObj("$image.FilterValues");
    for ( fieldname in filtervalues ) filtervalues[fieldname] = "";
    a.imagevar("$image.FilterValues", filtervalues );
}
/*
* setzt die Historien Bedingungen
*
* @param {String} pPersID opt ID der Person
* 
* @return {String []} der Feldnamen
*/
function setHistoryCondition( pPersID )
{
    var filtervalues;
    var i;
    var fieldnames = ["date_from", "date_until", "medium", "direction", "relation_id", "entrytype", "info", "subject", "organisation"];

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
    a.localvar( "$local.persid", pPersID );
    var user = tools.getUser(a.valueof("$sys.user"))
    var dslimit = user[tools.PARAMS]["dslimit"];
    if ( dslimit == undefined || dslimit == "" ) dslimit = "500";
    a.localvar( "$local.dslimit", dslimit );
    
    var res = a.askUserQuestion(a.translate("Bitte Filterbedingungen setzen"), "DLG_HISTORY_FILTER");

    if( res != null && res != undefined && res != "")
    {
        for (i = 0; i < fieldnames.length; i++ )
            filtervalues[fieldnames[i]] = res["DLG_HISTORY_FILTER." + fieldnames[i]];
        dslimit = res["DLG_HISTORY_FILTER.dslimit"]; // Datensatzlimit setzen
        user = tools.getUser(a.valueof("$sys.user"))
        user[tools.PARAMS]["dslimit"] = dslimit;
        tools.updateUser(user);
    }
    a.imagevar("$image.FilterValues", filtervalues );
}
/*
* Generiert den Where-Teil der SQL-Abfrage für Historienenträge in Abhängigkeit von den Filterfeldern.
*
* @return {String} die Bedingung
*/
function computeHistoryCondition()
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
    var tids = [];
    cond = makeCondition( fv["date_from"], cond, getTimeCondition("history.entrydate", ">=", fv["date_from"], "AO_DATEN"));		
    cond = makeCondition( fv["date_until"], cond, getTimeCondition("history.entrydate", "<=", fv["date_until"], "AO_DATEN"));		
    cond = makeCondition( fv["medium"], cond, "history.medium = " + fv["medium"]);		
    cond = makeCondition( fv["direction"], cond, "history.direction = '" + fv["direction"] + "'");		
    cond = makeCondition( fv["entrytype"], cond, "history.historyid in ( select HISTORY_ID from HISTORY_THEME where THEME_ID in ('" + getAllChilds(fv["entrytype"], tids).join("', '") + "'))" ); //Themen 		
    cond = makeCondition( fv["relation_id"], cond, "history.relation_id = '" +  fv["relation_id"] + "'");		
    cond = makeCondition( fv["organisation"], cond,	"history.historyid in (select history_id from historylink where row_id = '" + fv["organisation"] + "')");		
    cond = makeCondition( fv["info"], cond,	getPlaceHolderCondition( cast("history.info", "varchar", "1000", "AO_DATEN"), fv["info"] ) );
    cond = makeCondition( fv["subject"], cond, getPlaceHolderCondition( "history.subject", fv["subject"] ) );
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
* Erzeugt Historieneinträge mit Historylinks für alle angegebenen Relationen.
*
* @param {String} pRelationID req die Relation des zuständigen Mitarbeiters
* @param {Integer} pMedium req das Medium
* @param {String} pDirection req Richtung des Mediums
* @param {String} pSubject req Betreff des Historieneintrags
* @param {String} pInfo req Text für den Historieneintrag
* @param {[]} pLink req die Verknüpfungen für die Historylinkeinträge
* @param {String []} pRelationIDs req die Relationen für die der Historylink erstellt werden soll
*
* @return {void}
*/
function newMultiHistory(pRelationID, pMedium, pDirection, pSubject, pInfo, pLink, pRelationIDs)
{	
    // Historylink für jede relation anfügen
    for (var i=0; i<pRelationIDs.length; i++)
    {
        pLink.push( new Array( pRelationIDs[i], getRelationType( pRelationIDs[i] )));
    }
    newHistory(pRelationID,  pMedium, pDirection, pSubject, pInfo, pLink);
}

/*
* Erzeugt einen Historieneintrag mit Historylinks für die angegebenen Relationen.
*
* @param {String} pRelationID req die Relation des zuständigen Mitarbeiters
* @param {Integer} pMedium req das Medium
* @param {String} pDirection req Richtung des Mediums
* @param {String} pSubject req Betreff des Historieneintrags
* @param {String} pInfo req Text für den Historieneintrag
* @param {[]} pLink req die Verknüpfungen für die Historylinkeinträge
* @param {Datetime} pDateNew req aktuelles Datum
* @param {String} pUserNew opt aktueller User
*
* @return {String} HISTORYID
*/
function newHistory(pRelationID, pMedium, pDirection, pSubject, pInfo, pLink, pDateNew, pUserNew)
{
    var datum = a.valueof("$sys.date");
    if (pUserNew == undefined) var user = a.valueof("$sys.user"); else user = pUserNew;
    return newCompleteHistory(pRelationID, pMedium, pDirection, datum, user, "", pSubject, pInfo, pLink,a.valueof("$sys.dbalias"), pDateNew);
}


/*
* Erzeugt einen Historieneintrag mit Historylinks für die angegebenen Relationen.
*
* @param {String} pRelationID req die Relation des zuständigen Mitarbeiters
* @param {Integer} pMedium req das Medium
* @param {String} pDirection req Richtung des Mediums
* @param {Datetime} pEntryDate req Datum des Historieneintrags
* @param {String} pUser req User des Historieneintrags
* @param {String} pMailID req Link zu einer Mail 
* @param {String} pSubject req Betreff des Historieneintrags
* @param {String} pInfo Text req für den Historieneintrag
* @param {[]} pLink req die Verknüpfungen für die Historylinkeinträge
* @param {String} pdbalias opt Datenbankalias
* @param {Datetime} pDateNew opt aktuelles Datum
*
* @return {String} HISTORYID
*/
function newCompleteHistory( pRelationID, pMedium, pDirection, pEntryDate, pUser, pMailID, pSubject, pInfo, pLink, pdbalias, pDateNew)
{
    pdbalias = ( pdbalias == undefined ? a.valueof("$sys.dbalias") : pdbalias );
    var datum = ( pDateNew == undefined ? a.valueof("$sys.date") : pDateNew );
    var toInsert = new Array();
    var i;
	
    var histcols = new Array("historyid", "relation_id", "entrydate", "medium", "direction", "subject", "date_new", "date_edit", "user_new", "info", "mail_id");
    var histtypes = a.getColumnTypes(pdbalias, "history", histcols);
    var histvals = new Array(a.getNewUUID(), pRelationID, pEntryDate, pMedium, pDirection, pSubject, datum, datum, pUser, pInfo, pMailID);
    toInsert.push(new Array("history", histcols, histtypes, histvals));	

    //  Wenn Relation eine Funktion ist dann auch OrgRelation einfügen; 
    for (i =0; i < pLink.length; i++)
    {
        if ( pLink[i][1] == 3)   
        {
            var orgrelation = a.sql("select RELATIONID from RELATION where PERS_ID is null and ORG_ID = " 
                + "( select ORG_ID from RELATION where RELATIONID = '" + pLink[i][0] + "')" );
            // Nur einfügen wenn link noch nicht vorhanden 
            insertLink( pLink, new Array(orgrelation, "1") )
        }
    }
    if (pLink != null)
    {
        var links = newLink(histvals[0], pLink, "false",pdbalias, pDateNew);
        for (i=0; i<links.length; i++)
        {
            toInsert.push(links[i]);
        }
    }
    a.sqlInsert(toInsert);
    setGrants( histvals[0], new FrameData().getFrameID("HISTORY") );
    return histvals[0];
}
/*
* Prüft ob linkeintrag schon vorhanden, wenn nicht wird Link eingefügt
*
* @param {[]} pLink req vorhandene Verknüpfungen
* @param {[]} pInsertLink req einzufügende Verknüpfung
*
* @return {void}
*/
function insertLink( pLink, pInsertLink )
{
    for ( y = 0; y < pLink.length; y++)
    {
        if ( pLink[y].join("-") == pInsertLink.join("-") ) return;
    }
    pLink.push(pInsertLink);
}

/*
* Erzeugt Historylinks für die angegebenen Relationen.
*
* @param {String} pdbalias req Datenbankalias
* @param {Datetime} pDateNew req aktuelles Datum
* @param {String} pHistoryID req HistorienID
* @param {[]} pLink req Verknüpfungen für den Historieneintrag
* @param {Boolean} pDoInsert req soll eingefügt werden
*
* @return {String [[]]}
*/
function newLink(pHistoryID, pLink, pDoInsert, pdbalias, pDateNew)
{
    var datum = ( pDateNew == undefined ? a.valueof("$sys.date") : pDateNew );
    var user = a.valueof("$sys.user");
    var linkToInsert = new Array();

    var histlinkcols = new Array("HISTORYLINKID", "HISTORY_ID", "ROW_ID", "OBJECT_ID", "DATE_NEW", "DATE_EDIT", "USER_NEW");
    var histlinktypes = a.getColumnTypes(pdbalias, "HISTORYLINK", histlinkcols);
	
    for (var i=0; i<pLink.length; i++)
    {
        var histlinkvals = new Array(a.getNewUUID(), pHistoryID, pLink[i][0], String(pLink[i][1]), datum, datum, user);
        linkToInsert.push(new Array("historylink", histlinkcols, histlinktypes, histlinkvals)) ;
        if (pDoInsert == "true")
        { 
            //Prüfen ob Historylink bereits vorhanden
            var query = "select count(*) from historylink where history_id = '" + pHistoryID + "' and object_id = " + pLink[i][1] + " and row_id = '" + pLink[i][0] + "' ";
            if(a.sql(query) == "0")
                a.sqlInsert("historylink", histlinkcols, histlinktypes, histlinkvals);
        }
    }
	
    if (pDoInsert != "true")
    {
        return linkToInsert;
    }
    return [];
}

/*
* @param {[]} pMandatory req -- Zweidimensionales Array aus ( feldbezeichnung, beschreibung )
* @param {String} pDialog req -- Variable mit dem Ergebnis eines askUserQuestion-Aufrufs
* 
* @return {String []} Stringarray mit den Namen der nicht gefüllten Pflichtfelder oder ein leeres Array (Länge 0)
*/
function checkMandatoryFields(pMandatory, pDialog)
{
    var res = [];
    for(var i=0; i < pMandatory.length; i++)
    {
        if(pDialog[pMandatory[i][0]] == "") 
        {
            res.push(pMandatory[i][1]);
        }
    }
    return res;
}

/*
* Gibt Suchformel für History zurück
*
* @return {String}
*/
function getHisorySearchLink()
{
    var frame = a.valueofObj("$image.Frame")
    var fid = frame.Id;
    var condition = " where HISTORYLINK.OBJECT_ID ";
    if ( fid == 2 ) condition += " in ( 2, 3 ) ";
    else condition += " = " + fid;
    condition +=  " and " + a.valueof("$local.condition") + " ) "
	
    return frame.Table + "." + frame.IDColumn + " IN ( SELECT HISTORYLINK.ROW_ID FROM HISTORY join HISTORYLINK on HISTORYID = HISTORYLINK.HISTORY_ID " + condition;
}

/*
* Eintrag in die History mit Anhang der Worddatei.
*
* @param {String} pCondition req [SQL-Where-Condition oder Array pCondition req mit RelationIDs]
* @param {String} pMedium opt Medium
* @param {String} pDirection opt Richtung
* @param {String} pSubject opt Subject
* @param {String} pInfo opt Info
* @param {[]} pToLink opt Links
* @param {[]} pFileList opt Filelist
*
* @return {void}
*/
function InsertHistory( pCondition, pMedium, pDirection, pSubject, pInfo, pToLink, pFileList )
{
    if ( pMedium == undefined ) pMedium = "";
    if ( pSubject == undefined ) pSubject = "";
    if ( pInfo == undefined ) pInfo = "";
    if ( pToLink == undefined ) pToLink = [];
    if ( pFileList == undefined ) pFileList = "";
    if ( pDirection == undefined ) pDirection = "";
    var orgrelids = [];
    var sqlstr = " select RELATION.RELATIONID, case when RELATION.PERS_ID is null then 1 else case when " + trim("RELATION.ORG_ID") + " = '0' then 2 else 3 end end, "
    + " ( select max(RELATIONID) from RELATION where PERS_ID is null and ORG_ID = ORG.ORGID  )"  
    + " from RELATION join ORG on RELATION.ORG_ID = ORG.ORGID join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID"
    + " left join PERS on RELATION.PERS_ID = PERS.PERSID";

    // wenn Array mit RelationIDs
    if ( typeof(pCondition) == "object")	pCondition = "RELATION.RELATIONID in ('" + pCondition.join("','") + "')";
    if ( pCondition != "" ) sqlstr += " where " + pCondition;
    var rellist = a.sql( sqlstr, a.SQL_COMPLETE ); 
    for ( var i = 0; i < rellist.length; i++ )
    {
        if (  rellist[i][1] == "1" )		orgrelids[rellist[i][0]] = "";
        pToLink.push( [rellist[i][0], rellist[i][1]] );
        if ( rellist[i][1] == "3" )   
        {
            if ( orgrelids[rellist[i][2]] == undefined )
            {
                orgrelids[rellist[i][2]] = "";
                pToLink.push( [rellist[i][2], "1"] );
            }
        }
    }
    var medium = a.sql("SELECT KEYVALUE FROM KEYWORD WHERE" + getKeyTypeSQL("HistoryMedium") +" AND KEYNAME1 = '" + pMedium + "'");
    var prompts = new Array();
    var defaultvalue = new Array();
    defaultvalue["$comp.INFO"] = pInfo;
    defaultvalue["$comp.SUBJECT"] = pSubject;
    defaultvalue["$comp.DIRECTION"] = pDirection;
    defaultvalue["$comp.MEDIUM"] = medium;
    prompts["autoclose"] = false;
    prompts["toLink"] = pToLink;
    prompts["DefaultValues"] = defaultvalue;
    prompts["FileList"] = pFileList;
    if ( a.hasvar("$image.FrameID") )
    {
        if ( a.hasvar("$comp.Table_history") )	prompts["comp4refresh"] = "$comp.Table_history";
        a.openLinkedFrame("HISTORY", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);
    }
    else		a.openFrame("HISTORY", null, false, a.FRAMEMODE_NEW, null, false, prompts);
}

/*
* Aufgabe auf Erledigt setzen
*
* @param {String} pIDs req ID der markierten Kalender-Einträge
* @param {String} pTable opt Tablename, wenn nicht angegeben dann $comp.tbl_Aufgabe
*
* @return {void}
*/
function makeTaskDone(pIDs, pTable)
{
    if ( pTable == undefined ) pTable = "$comp.tbl_Aufgabe";
    var Entry = "";
    for (i=0; i<pIDs.length; i++)
    {
        Entry = calendar.getEntry(pIDs[i])[0];
        Entry[calendar.STATUS] = calendar.STATUS_COMPLETED;
        calendar.update(new Array(Entry));
        if ( a.valueofObj("$global.setCalendarHistory") == "true" ) 	insertHistory(Entry);
    }
    a.refresh(pTable);
}

/*
* Historie aus Kalender eintragen
*
* @param {String} pEntry req = calendar.getEntry(pIDs[i])[0] des Kalender-Eintrags, der zur Historie hinzugefügt werden soll
*
* @return {void}
*/
function insertHistory(pEntry)
{
    var linkscount = pEntry[calendar.LINKS];
    var links = [];
    var relationids = [];
    for ( var i = 1; i <= linkscount; i++ )
    {
        var frame = new FrameData().getData("name", pEntry["LINK_FRAME_" + i].substring(5), ["id","history"])[0];
        var dbid =  pEntry["LINK_DBID_" + i];
        if ( frame[0] < 4 ) relationids.push(dbid);
        else if ( frame[1] )	links.push([ dbid, frame[0] ])
    }
    if ( links.length > 0 || relationids.length > 0  )	
        InsertHistory( relationids, "", "", pEntry[calendar.SUMMARY], pEntry[calendar.DESCRIPTION], links );
}