import("lib_grant");

/*
* löscht Recipients
* 
* @param {String} pTableName req Tabellenname der Condition
* @param {String} pCondition req Condition
* @param {String} pCampaignID req ID der Kampagne
*
* @return {integer} Anzahl der gelöschten Mitglieder
*/
function deleteParticipantsWithCondition( pTableName, pCondition, pCampaignID )
{
    if ( pCampaignID == undefined ) pCampaignID = chooseCampaign();
    var sqlstr = "select CAMPAIGNPARTICIPANTID from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID "
    + " join CAMPAIGNPARTICIPANT on RELATIONID = CAMPAIGNPARTICIPANT.RELATION_ID and CAMPAIGN_ID = '" + pCampaignID + "' ";
    switch( pTableName )
    {
        case "PERS":
            sqlstr += " join PERS on RELATION.PERS_ID = PERS.PERSID ";
            break;
        case "ORG":				
            sqlstr += " join ORG on RELATION.ORG_ID = ORG.ORGID ";
            break;
        case "DISTLIST":			
            sqlstr += " join DISTLISTMEMBER on DISTLISTMEMBER.RELATION_ID = RELATIONID ";
            break;
    }
    sqlstr += " where "	+ pCondition;
    var relids = a.sql( sqlstr, a.SQL_COLUMN );
    if ( relids.length > 0)
    {
        if ( a.askQuestion( relids.length + " " + a.translate("Mitglieder entfernen") + " ?", a.QUESTION_YESNO, "") == "true")
        {
            a.sqlDelete("CAMPAIGNLOG", "CAMPAIGNPARTICIPANT_ID in (" + sqlstr + ")");			
            return a.sqlDelete("CAMPAIGNPARTICIPANT", "CAMPAIGNPARTICIPANTID in (" + sqlstr + ")");			
        }
    }
    else a.showMessage( a.translate("Kein Mitglied zum entfernen"));
    return 0;
}

/*
* Fügt Empfänger zu einer Kampagne hinzu.
*
* @param {String} pTableName req Tabellenname der Condition
* @param {String} pCondition req Condition
* @param {String} pCampaignID req ID des Kampagne
*
* @return {integer} Anzahl der hinzugefügten Mitglieder
*/
function addParticipantsWithCondition( pTableName, pCondition, pCampaignID )
{
    if ( pCampaignID == undefined ) pCampaignID = chooseCampaign();
    var count = 0;
    if ( pCampaignID != "" )
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
            case "DISTLIST":			
                sqlstr += " join DISTLISTMEMBER on DISTLISTMEMBER.RELATION_ID = RELATIONID where "	+ pCondition;
                break;
            case "CAMPAIGN":			
                sqlstr += " where "	+ pCondition;
                break;
        }
        sqlstr += " AND RELATIONID NOT IN (SELECT RELATION_ID FROM CAMPAIGNPARTICIPANT WHERE CAMPAIGN_ID = '" + pCampaignID + "') ";

        var participants = a.sql( sqlstr, a.SQL_COLUMN );
        if ( participants.length > 0 )
        {
            if (a.askQuestion(participants.length + " " + a.translate("Mitglieder hinzufügen") + " ?", a.QUESTION_YESNO, "") == "true")
            {
                count =  addParticipants( participants, pCampaignID );
            }
        }		
        else a.showMessage( a.translate("Kein Mitglied zum hinzufügen"));
    }
    return count;
}

/*
* Wählt eine Kampagne aus.
*
* @return Id des Kampagne
*/
function chooseCampaign()
{
    var campaignid = "";
    var condition = getGrantCondition("CAMPAIGN", "", "", "INSERT");
    if ( condition != "" ) condition = " where " + condition;
    // Sind Selectionen für den User vorhanden ?
    selanz = a.sql ("select count(*) from CAMPAIGN " + condition);
    if (selanz  > 0) 
    {
        var antwort = a.askUserQuestion(a.translate("Bitte wählen Sie eine Kampagne !"), "DLG_CHOOSE_CAMPAIGN");
        if (antwort != null)
        {
            var selection = antwort["DLG_CHOOSE_CAMPAIGN.selection"];
            campaignid =  a.decodeFirst(selection);
        }
    }
    else a.showMessage(a.translate("Kein Kampagne vorhanden!"));
    return campaignid;
}

/*
* Fügt Mitglieder zu einer Kampagne hinzu.
*
* @param {String []} pParticipants req die RELATIONID
* @param {String} pCampaignID opt die ID der Kampagne 
* @param {String} pStepID opt ID des Schritts
*
* @return {integer} Anzahl keine Email vorhanden
*/
function addParticipants( pParticipants, pCampaignID, pStepID )
{
    if ( pCampaignID != "" )
    {
        var count = 0;
        if ( pStepID == undefined ) pStepID = selectCampaignStep(pCampaignID);
        if ( pStepID != null )
        {
            // aktuelle Anzahl - maximale Anzahl
            var iscount = Number(a.sql("select count(*) from campaignparticipant where campaign_id = '" + pCampaignID + "'"));
            var maxcount = a.sql("select max_participants from campaign where campaignid = '" + pCampaignID + "'");
            if ( maxcount != "")	maxcount = Number(maxcount); else maxcount = 9999999;
			
            var actdate = a.valueof("$sys.date");
            var user = a.valueof("$sys.user");
            var spalten = new Array("CAMPAIGNPARTICIPANTID", "RELATION_ID", "USER_NEW", "DATE_NEW", "CAMPAIGNSTEP_ID", "CAMPAIGN_ID");
            var typen = a.getColumnTypes("CAMPAIGNPARTICIPANT", spalten);
            var logcol = new Array("CAMPAIGN_ID", "STEP_ID", "RELATION_ID", "CAMPAIGNPARTICIPANT_ID", "DATE_NEW", "USER_NEW");
            var logtyp = a.getColumnTypes("CAMPAIGNLOG", logcol);
            var logvalue = new Array(pCampaignID, pStepID, 0, 0, actdate, user );

            for ( var i = 0; i < pParticipants.length; i++ )	
            {
                if ( iscount < maxcount )
                {
                    var newID = a.getNewUUID()
                    var werte = [ newID, pParticipants[i] , user, actdate, pStepID, pCampaignID ];
                    count += a.sqlInsert("CAMPAIGNPARTICIPANT", spalten, typen, werte);		
                    logvalue[2] = pParticipants[i];
                    logvalue[3] = newID;
                    a.sqlInsert("CAMPAIGNLOG", logcol, logtyp, logvalue);
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
* Generiert den Where-Teil der SQL-Abfrage für Kampagnenteilnehmer in Abhängigkeit von den Filterfeldern.
*
* @return {String} die Bedingung
*/
function computeCondition()
{
    var campaignid = a.valueof("$comp.campaignid");
    var steps = a.decodeMS(a.valueof("$comp.Liste_step_included")).join("', '");
    var laststep = a.valueof("$comp.chk_laststep");
    var employee = a.valueof("$comp.employee");
    var channel = a.valueof("$comp.channel");
    var condition = "";
	
    if (steps != "" && laststep == 'N')
    {
        condition = " and relationid in (select max(campaignlog.relation_id) from campaignlog "
        + " where step_id in ('" + steps + "') and campaignlog.campaign_id = '" + campaignid + "' "
        + " group by campaignlog.relation_id)";
    }
    if (steps != "" && laststep == 'Y') condition += " and campaignstep_id in ('" + steps + "')";
    if (employee != "") condition += " and employee_relation_id = '" + employee + "'";
    if (channel != "") condition += " and favoritechannel = '" + channel + "'";
	
    return condition;
}

/*
* Setzt die angegebene Kampagnenstufe für die angegebenen Teilnehmer.	
*			
* @param {String} pCampaignID req die Kampagne
* @param {String} pStepID req die Kampagnenstufe
* @param {[]} pRelationIDs req die relids der Teilnehmer
*
* @return {void}
*/
function setCampaignStep(pCampaignID, pStepID, pRelationIDs)
{
    var sysdate = a.valueof("$sys.date");
    var user = a.valueof("$sys.user");
    var col = new Array("CAMPAIGNSTEP_ID", "DATE_EDIT", "USER_EDIT");
    var typ = a.getColumnTypes("CAMPAIGNPARTICIPANT", col);
    var value = new Array( pStepID, sysdate, user);
    var logcol = new Array("CAMPAIGN_ID", "STEP_ID", "RELATION_ID", "CAMPAIGNPARTICIPANT_ID", "DATE_NEW", "USER_NEW");
    var logtyp = a.getColumnTypes("CAMPAIGNLOG", logcol);
    var logvalue = new Array(pCampaignID, pStepID, 0, 0, sysdate, user );

    for(var i = 0; i < pRelationIDs.length; i++)
    {
        a.sqlUpdate("CAMPAIGNPARTICIPANT", col, typ, value, "CAMPAIGN_ID = '" + pCampaignID
            + "' and RELATION_ID = '" + pRelationIDs[i] + "'");
        logvalue[2] = pRelationIDs[i];
        logvalue[3] = a.sql("select CAMPAIGNPARTICIPANTID from CAMPAIGNPARTICIPANT where CAMPAIGN_ID = '" 
            + pCampaignID + "' and RELATION_ID = '" + pRelationIDs[i] + "'");
        a.sqlInsert("CAMPAIGNLOG", logcol, logtyp, logvalue);
    }		
}

/*
* Gibt die RelationIDs der Campaigne zurück.
*
* @return {[]} mit RelationIDs
*/
function getRelationIDs()
{
    var relids = "";
    var participants =  a.decodeMS(a.valueof("$comp.tbl_participants"));
    // Participants markiert ?		
    if ( participants.length == 0)
    {
        if ( a.askQuestion(a.translate("Möchten Sie alle Teilnehmer verwenden ?"), a.QUESTION_YESNO, "") == "true" )
        {
            var pCampaignID = a.valueof("$comp.idcolumn");
            relids = a.sql("SELECT RELATION_ID FROM CAMPAIGNPARTICIPANT join relation on (relationid = relation_id) WHERE CAMPAIGN_ID = '" 
                + pCampaignID + "'" + computeCondition(), a.SQL_COLUMN)
        }
        else
        {
            a.showMessage(a.translate("Markieren Sie bitte die Teilnehmer!"));
        }
    }
    else
    {
        relids = a.sql("SELECT RELATION_ID FROM CAMPAIGNPARTICIPANT where CAMPAIGNPARTICIPANTID in ('" + participants.join("', '") + "')", a.SQL_COLUMN );
    }
	
    return relids;
}	

/*
* Liefert die ID einer Kampagnenstufe nach der Auswahl des Benutzers aus einer Combobox.
*
* @param {String} pCampaign req die CAMPAIGNID der Kampagne, aus der eine Stufe gewaehlt werden soll
*
* @return {String} ID der Kampagnenstufe
*/

function selectCampaignStep(pCampaign)
{
    // neue stufe waehlen
    var stepid = null;
    var steps = a.sql("select step from campaignstep where campaign_id = '" + pCampaign + "' order by code", a.SQL_COLUMN);
    if ( steps.length > 0 )
    {
        for(i = 0; i < steps.length; i++) steps[i] = a.translate(steps[i]);
        var step = a.askQuestion(a.translate("Auf welche Stufe möchten Sie die Teilnehmer setzen?"), a.QUESTION_COMBOBOX, "|" + steps.join("|"));

        if (step != null )
        {
            stepid = a.sql("select campaignstepid from campaignstep where campaign_id = '" + pCampaign + "' and step = '" + step + "'");
        }
    }
    else a.showMessage(a.translate("Keine Stufe vorhanden!"));
    return stepid;
}

/*
* Liefert das Ergebnis der Interview-Prüfung
*
* @param {String} pQuestionnaireID req die ID des zu prüfenden Interviews
*
* @return {String} Text des Prüfungsergebnisses
*/
function testQuestionnaire(pQuestionnaireID)
{
    var text = "";

    //1. Prüfen ob es zu jeder Frage auch eine Antwort gibt. 
    var check1 = a.sql("select Questioncode, Questiontext"
        + " from question left outer join questionflow on (question.questionid = questionflow.question_id)"
        + " where questionnaire_id = '" + pQuestionnaireID + "'"
        + " and questionflow.questionflowid is null", a.SQL_COMPLETE);
	
    for (var i = 0; i < check1.length; i++)
    {
        if (i == 0) 
        {
            text = text + a.translate("Zu folgenden Fragen wurden keine Antworten und Zielcodes angegeben:") + "\n\n"
        }
	
        text = text + a.translate("Frage") + " " + check1[i][0] + " - " + check1[i][1] + "\n";
    }


    //2. Prüfen ob Ende Kennzeichen gesetzt.; bei Ende KZ wird in targetquestion_id 0 eingetragen
    var check2 = a.sql("select count(*)"
        + " from question left outer join questionflow on (question.questionid = questionflow.question_id)"
        + " where questionnaire_id = '" + pQuestionnaireID + "'"
        + " and targetquestion_id = '0'");

    if (check2 == 0) {
        text = text + "\n\n" + a.translate("Es wurde kein Ende Kennzeichen angegeben!")
    }
    return (text)
}