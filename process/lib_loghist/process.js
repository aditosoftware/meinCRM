import("lib_keyword");
import("lib_sql");
import("lib_attr");
import("lib_relation");

/*
* Speichert die Änderungen der DB-Spalten, die im Repository eingeschalteten sind, in die Tabelle LOGHIST
*
* @param {String} pTable req TableName
* @param {String} pUser req UserName
* @param {String []} pColumns req ColumnNames
* @param {String []} pNewValues req new Values
* @param {String []} pOldValues req old Values
* @param {Date} pTimeStamp req TimeStamp
* @param {String} pAction req SQLAction
* @param {String} pIdValue req IdValue
*
* @return 	{void}
*/

function log_history( pTable, pUser, pColumns, pNewValues, pOldValues, pTimeStamp, pAction, pIdValue )
{
    pTable = pTable.toUpperCase();
    var repository = a.sql("select COLUMNNAME, AOSYS_COLUMNREPOSITORY.LONGNAME, DATATYPE, KEYNAME from AOSYS_COLUMNREPOSITORY join AOSYS_TABLEREPOSITORY on TABLE_ID = TABLEID "
        + " and AOSYS_COLUMNREPOSITORY.LOGGING = 'Y' and TABLENAME = '" + pTable + "'", a.SQL_COMPLETE);
    var i; 
        

    if ( repository.length > 0 )
    {
        var description = "";
        var coldef = new Object();
        var idvalue = pIdValue;
        var extra = [];
        extra["COMM"] = {
            IDs: ["RELATION_ID", "MEDIUM_ID"], 
            Description: "Kommunikation"
        };
        extra["ATTRLINK"] = {
            IDs: ["ROW_ID", "ATTR_ID"], 
            Description: "Eigenschaft"
        };

        for (i = 0; i < repository.length; i++ )		coldef[repository[i][0]] = [ repository[i][1], repository[i][2], repository[i][3] ];

        // Extrabehandlung
        if ( extra[pTable] != undefined )
        {
            var conf = extra[pTable];
            var oldvalues = [];
            var newvalues = [];
            for(i = 0; i < pColumns.length; i++ )
            { 
                if ( pAction == 'D' || pAction == 'U' )  oldvalues[pColumns[i]] =  pOldValues[i]; 
                if ( pAction == 'I' || pAction == 'U' )  newvalues[pColumns[i]] =  pNewValues[i];					 
            }
            if ( pAction == 'D' ) newvalues = oldvalues; 	
            if ( ( pAction == 'D' || pAction == 'I' ) && newvalues[conf.IDs[1]] != undefined )	
            {
                idvalue = newvalues[conf.IDs[0]];
                var data = getData( pTable, newvalues[conf.IDs[1]], newvalues, idvalue );
                description += conf.Description + " " + data[0] + ": '" +  data[1] + "'";
            }
            if ( pAction == 'U' )
            {
                var ids = a.sql("select " + conf.IDs.join(", ") + " from " + pTable + " where " + pTable + "ID = '" + pIdValue + "'", a.SQL_ROW);
                idvalue = ids[0];
                var oldid =  ids[1];
                if ( oldvalues[conf.IDs[1]] != undefined ) 	oldid =  oldvalues[conf.IDs[1]];
			 	
                var olddata = getData( pTable, oldid, oldvalues, idvalue );
                var newdata = getData( pTable, ids[1], newvalues, idvalue );				
                if ( olddata[0] == newdata[0])	description += conf.Description + " " + olddata[0] + " von '" +  olddata[1] + "' auf '" + newdata[1]  + "' ";
                else description += conf.Description + " " + olddata[0] + " von '" +  olddata[1] + "' auf " + conf.Description + " " + newdata[0] + " '" + newdata[1]  + "' ";
            }
        }
        else	// Behandlung für alle Tabellen
        {
            for(i = 0; i < pColumns.length; i++ )
            { 
                var logfield = coldef[pColumns[i]];
                if ( logfield != undefined )
                {					
                    if (logfield[1] == "keyword")
                    {
                        if ( ( pAction == 'U' || pAction == 'D' ) && pOldValues[i] != "") pOldValues[i] = getKeyName(pOldValues[i], logfield[2]);
                        if ( ( pAction == 'U' || pAction == 'I' ) && pNewValues[i] != "") pNewValues[i] = getKeyName(pNewValues[i], logfield[2]);
                    }
                    if (logfield[1] == "datetime")
                    {
                        if ( ( pAction == 'U' || pAction == 'D' ) && pOldValues[i] != "") pOldValues[i] = date.longToDate(pOldValues[i], "dd.MM.yyyy", "Europe/Berlin");
                        if ( ( pAction == 'U' || pAction == 'I' ) && pNewValues[i] != "") pNewValues[i] = date.longToDate(pNewValues[i], "dd.MM.yyyy", "Europe/Berlin");
                    }
                    if ( pAction == 'U' )		
                    {
                        if ( description != "" ) description += ", ";
                        description += logfield[0] + ": von '" + pOldValues[i] + "' auf '" + pNewValues[i] + "'";
                    }
                    if ( pAction == 'I' && pNewValues[i] != "" )
                    {
                        if ( description != "" ) description += ", ";
                        description += logfield[0] + ": '" + pNewValues[i] + "'";
                    }
                    if ( pAction == 'D' && pOldValues[i] != "" )
                    {
                        if ( description != "" ) description += ", ";
                        description += logfield[0] + ": '" + pOldValues[i] + "'";
                    }
                }
                // Sonderbehandlung ADDRESS
                if ( pTable == "ADDRESS" ) 
                {
                    if ( pAction == "I" && pColumns[i] == "RELATION_ID" ) 	idvalue = pNewValues[i];
                    if ( pAction == "D" && pColumns[i] == "RELATION_ID" ) 	idvalue = pOldValues[i];
                }
            }
            // Sonderbehandlung ADDRESS
            if ( pTable == "ADDRESS" && pAction == "U" )  idvalue = a.sql("select RELATION_ID from ADDRESS where ADDRESSID = '" + pIdValue + "'");		
        }
        if ( description != "" )
        {
            if ( pAction == 'I' )		description += " eingefügt.";
            if ( pAction == 'U' ) 	description += " geändert.";
            if ( pAction == 'D' ) 	description += " gelöscht.";
            var col = [ "LOGTYPE","TABLENAME","TABLENAMEID","DESCRIPTION","DATE_NEW","USER_NEW" ];
            var val = [ pAction, pTable, idvalue, description, pTimeStamp, pUser ];
            var typ = a.getColumnTypes("AOSYS_LOGHIST", col);
            a.sqlInsert("AOSYS_LOGHIST", col, typ, val);
        }
    }
    /**********************/
    function getData( ptable, pid, pValues, pRelationID )
    {
        var dat = [];
        if ( ptable == "ATTRLINK" ) dat = GetAttrAudit( pid, pValues[ getValueFieldName( pid ) ] );
        if ( ptable == "COMM" )
        {
            var keyname = "PersMedium";
            if ( getRelationType(pRelationID) == 1 )  keyname = "OrgMedium";
            dat[0] = getKeyName( pid, keyname );
            dat[1] = pValues["ADDR"];
        }
        return dat;
    }
}

/*
* gibt eine Arry der LOGHIST für die Anzeige im Frame zurück
*
* @param {String} pCondition req TableName
*
* @return {[]}	table
*/
function show_log_history( pCondition )
{
    var loglist = a.createEmptyTable(3);

    var log = a.sql("select DATE_NEW, USER_NEW, DESCRIPTION from AOSYS_LOGHIST where " + pCondition
        + " order by DATE_NEW desc", a.SQL_COMPLETE);

    if ( log.length > 0 )
    {
        loglist = [];
        var groupdate = date.longToDate(log[0][0], "dd.MM.yyyy HH:mm");
        var logdate = log[0][0];
        var loguser = log[0][1];						
        var descripton = log[0][2];

        for ( var i = 1; i < log.length; i++ )
        {
            if ( groupdate + loguser == date.longToDate(log[i][0], "dd.MM.yyyy HH:mm") + log[i][1] )
            {
                descripton = log[i][2] + "\n" + descripton;
            }
            else
            {
                loglist.push([logdate, loguser, descripton]);
                groupdate = date.longToDate(log[i][0], "dd.MM.yyyy HH:mm");
                logdate = log[i][0];
                loguser = log[i][1];						
                descripton = log[i][2];
            }
        }
        loglist.push([logdate, loguser, descripton]);
    }								
    return loglist;
}

/*
* gibt das Label mit der letzten Änderung aus zusätzlichen Tabellen zurück
*
* @param {String} pTableNames req TableName
* @param {String} pID req RELATIONID
* @param {Date} pDateNew
* @param {String} pUserNew
*
* @return {[]} table
*/
function show_label_new_edit( pTableNames, pID, pDateNew, pUserNew )
{
    var label = "";
    if ( pID != "" )
    {
        var editdata = a.sql("select DATE_NEW, USER_NEW from AOSYS_LOGHIST where TABLENAME in ('" + pTableNames.join("', '") + "')"
            + " and TABLENAMEID = '" + pID + "' order by DATE_NEW desc", a.SQL_ROW );
        label = a.translate("erstellt %0 von %1", [ date.longToDate(pDateNew, "dd.MM.yyyy"), pUserNew]);
        if ( editdata.length > 0 )	label += " | " + a.translate("geändert %0 von %1", [ date.longToDate(editdata[0], "dd.MM.yyyy"), editdata[1]]);
    }
    return label;
}