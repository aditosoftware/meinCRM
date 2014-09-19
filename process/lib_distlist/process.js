import("lib_grant");

/*
* löscht Recipients
*
* @param {String} pTableName req Tabellenname der Condition
* @param {String} pCondition req Condition
* @param {String} pDistlistID req ID des Verteiler
*
* @return {integer} Anzahl der gelöschten Mitglieder
*/
function deleteMembersWithCondition( pTableName, pCondition, pDistlistID )
{
    if ( pDistlistID == undefined ) pDistlistID = chooseDistlist();
    var sqlstr = "select DISTLISTMEMBERID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID join DISTLISTMEMBER on RELATIONID = DISTLISTMEMBER.RELATION_ID and DISTLIST_ID = '" + pDistlistID + "' ";
    switch( pTableName )
    {
        case "PERS":
            sqlstr += " join PERS on RELATION.PERS_ID = PERS.PERSID ";
            break;
        case "ORG":				
            sqlstr += " join ORG on RELATION.ORG_ID = ORG.ORGID ";
            break;
    }
    sqlstr += " where "	+ pCondition;
    var relids = a.sql( sqlstr, a.SQL_COLUMN );
    if ( relids.length > 0)
    {
        if ( a.askQuestion( relids.length + " " + a.translate("Mitglieder entfernen") + " ?", a.QUESTION_YESNO, "") == "true")
        {
            return a.sqlDelete("DISTLISTMEMBER", "DISTLISTMEMBERID in (" + sqlstr + ")");
        }
    }
    else a.showMessage( a.translate("Kein Mitglied zum entfernen"));
    return 0;
}

/*
* Fügt Mitglieder einem Verteiler hinzu.
*
* @param {String} pTableName req Tabellenname der Condition
* @param {String} pCondition req Condition
* @param {String} pDistlistID req ID des Verteiler
*
* @return {integer} Anzahl der hinzugefügten Mitglieder
*/
function addMembersWithCondition( pTableName, pCondition, pDistlistID )
{
    var count;
    if ( pDistlistID == undefined ) pDistlistID = chooseDistlist();
    count = 0;
    if ( pDistlistID != "" )
    {
        var sqlstr = "select RELATIONID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID ";
        switch( pTableName )
        {
            case "PERS":
                sqlstr += " join PERS on (RELATION.PERS_ID = PERS.PERSID) where RELATION.STATUS = 1 and "	+ pCondition;
                break;
            case "ORG":				
                sqlstr += " join ORG on (RELATION.ORG_ID = ORG.ORGID) where RELATION.PERS_ID is null and RELATION.STATUS = 1 and "	+ pCondition;
                break;
            case "":				
                sqlstr += " where "	+ pCondition;
                break;
        }
        sqlstr += " AND RELATIONID NOT IN (SELECT RELATION_ID FROM DISTLISTMEMBER WHERE DISTLIST_ID = '" + pDistlistID + "') ";
	
        var members = a.sql( sqlstr, a.SQL_COLUMN );
        if ( members.length > 0 )
        {
            if (a.askQuestion(members.length + " " + a.translate("Mitglieder hinzufügen") + " ?", a.QUESTION_YESNO, "") == "true")
            {
                count =  addMembers( members, pDistlistID );
            }
        }		
        else a.showMessage( a.translate("Kein Mitglied zum hinzufügen"));
    }
    return count;
}

/*
* Wählt einen Verteiler aus.
*
* @return Id des Verteiler
*/
function chooseDistlist()
{
    var distlistid = "";
    var condition = getGrantCondition("DISTLIST", "", "", "INSERT");
    if ( condition != "" ) condition = " where " + condition;
    // Sind Selectionen für den User vorhanden ?
    selanz = a.sql ("select count(*) from DISTLIST " + condition);
    if (selanz  > 0) 
    {
        var antwort = a.askUserQuestion(a.translate("Bitte wählen Sie einen Verteiler!"), "DLG_CHOOSE_DISTLIST");
        if (antwort != null)
        {
            var selection = antwort["DLG_CHOOSE_DISTLIST.selection"];
            distlistid =  a.decodeFirst(selection);
        }
    }
    else a.showMessage(a.translate("Kein Verteiler vorhanden!"));
    return distlistid;
}

/*
* Fügt Mitglieder einem Verteiler hinzu.
*
* @param {String []} pMembers req die RELATIONID
* @param {String} pDistlistID req die ID des Verteilers 
*
* @return {integer} Anzahl der eingefügten Mitglieder
*/
function addMembers( pMembers, pDistlistID )
{
    var count = 0;
    if ( pDistlistID != "" )
    {
        var spalten = new Array("DISTLISTMEMBERID", "RELATION_ID", "USER_NEW", "DATE_NEW", "DISTLIST_ID");
        var typen = a.getColumnTypes("DISTLISTMEMBER", spalten);
        var actdate = a.valueof("$sys.date");
        var user = a.valueof("$sys.user");
        for ( var i = 0; i < pMembers.length; i++ )	
        {
            var werte = [ a.getNewUUID(), pMembers[i] , user, actdate, pDistlistID ];
            count += a.sqlInsert("DISTLISTMEMBER", spalten, typen, werte);		
        }
    }
    return count;
}

/*
* Gibt die RelationIDs des Verteilers zurück.
*
* @return {String []} mit RelationIDs
*/
function getRelationIDsDL()
{
    var relids = "";
    // Distlistmeber markiert ?
    if (a.valueof("$comp.tbl_distlistmember") == "")
    {
        if ( a.askQuestion(a.translate("Möchten Sie alle Teilnehmer verwenden ?"), a.QUESTION_YESNO, "") == "true")
        {
            relids = a.sql("SELECT RELATION_ID FROM DISTLISTMEMBER WHERE DISTLIST_ID = '" + a.valueof("$comp.idcolumn") + "'", a.SQL_COLUMN);
        }
        else
        {
            a.showMessage(a.translate("Markieren Sie bitte die gewünschten Teilnehmer!"));
        }
    }
    else
    {
        var dlm_ids = a.decodeMS(a.valueof("$comp.tbl_distlistmember"));
        relids = a.sql("SELECT RELATION_ID FROM DISTLISTMEMBER WHERE DISTLISTMEMBERID in ( '" + dlm_ids.join("', '") + " ')", a.SQL_COLUMN )
    }
    return relids;
}