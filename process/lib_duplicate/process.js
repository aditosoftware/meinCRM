import("lib_sql");
import("lib_keyword");
import("lib_telephony");

/*
 * Liefert ein Array mit allen möglicher Dubletten.
 *
 * @param {String} pRelationID req RelationID
 * @param {String} pPattern req Suchpattern 
 * 
 * @return {String [[]]} (potenzieller Dubletten)
 */
function hasOrgDuplicates( pRelationID, pPattern )
{
    var dup = a.indexSearch( pPattern, false, ["ORG"])["HITS"];
    var rows = [];
    for ( var z = 0; z < dup.length && z < 50; z++ )
    {
        var relid = dup[z]["#ADITO_SEARCH_ID"];
        var nodup = a.sql("select count(*) from NODUPLICATE where ( RELATION1_ID = '" + trim(pRelationID) 
            + "' and RELATION2_ID = '" + trim(relid) + "') or ( RELATION2_ID = '" + trim(pRelationID) 
            + "' and RELATION1_ID = '" + trim(relid) + "')");
        if ( trim(pRelationID) != trim(relid) && nodup == 0 )    rows.push( relid );
    }
    return rows;
}		
/*
 * Liefert ein Array mit allen möglicher Dubletten.
 *
 * @param {String} pRelationID req RelationID
 * @param {String} pPersID req PersID
 * @param {String} pPattern req Suchpattern
 * 
 * @return {String [[]]} (potenzieller Dubletten)
 */
function hasPersDuplicates( pRelationID, pPersID, pPattern )
{
    var dup = a.indexSearch( pPattern, false, ["PERS"])["HITS"];
    var rows = [];
    for ( var z = 0; z < dup.length && z < 50; z++ )
    {
        var relid = dup[z]["#ADITO_SEARCH_ID"];
        var persid = a.sql("select PERS_ID from RELATION where RELATIONID = '" + relid + "'");
        var nodup = a.sql("select count(*) from NODUPLICATE where ( RELATION1_ID = '" + pPersID 
            + "' and RELATION2_ID = '" + persid + "') or ( RELATION2_ID = '" + pPersID
            + "' and RELATION1_ID = '" + persid + "')");
        if ( trim(pRelationID) != trim(relid) && nodup == 0 && pPersID != persid )    rows.push( relid );
    }
    return rows;
}		

/*
 * Ermittelt das Pattern für die Inexsuche für Frame ORG
 *
 * @return {String} Pattern
 */
function getOrgFramePattern()
{
    var ddata = [];
    var comm = [];
    var param = []; 
    var commdata = [];
    var data = getKeyList( "DuplicateOrgPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
    for ( i = 0; i < data.length; i++ ) param[data[i][0]] = data[i];

    // Felder
    ddata.push(["orgname", a.valueof("$comp.orgname")]);
    // Adressen
    data = a.getTableData("$comp.tbl_ADDRESS", a.ALL);
    for ( i = 0; i < data.length; i++ )
    {
        ddata.push(["address", [ [ "city", data[i][8]], ["address", data[i][4]], ["zip", data[i][7]], ["country", data[i][12]] ] ]);
    }
    // Kommunkationsdaten
    data = a.getTableData("$comp.Table_comm", a.ALL);
    var medium = getKeyList( "OrgMedium", ["KEYVALUE", "KEYNAME2"] );
    for ( i = 0; i < medium.length; i++ ) comm[medium[i][0]] = medium[i][1];
    for ( i = 0; i < data.length; i++ ) commdata.push([comm[data[i][2]], data[i][3] ] );
    if ( commdata.length > 0 )  ddata.push(["comm", commdata ] );
    return getPattern( ddata, param );
}

/*
 * Ermittelt das Dublettenkriterium für Frame PERS
 *
 * @return {String} das Dublettenkriterium
 */
function getPersFramePattern()
{
    var ddata = [];
    var comm = [];
    var param = []; 
    var commdata = [];
    var data = getKeyList( "DuplicatePersPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
    for ( i = 0; i < data.length; i++ ) param[data[i][0]] = data[i];

    // Felder
    // ddata.push(["orgname", a.valueof("$comp.orgname")]);
    ddata.push(["salutation", a.valueof("$comp.salutation")]);
    ddata.push(["lastname", a.valueof("$comp.lastname")]);
    ddata.push(["firstname", a.valueof("$comp.firstname")]);
    // Adressen
    data = a.getTableData("$comp.tbl_ADDRESS", a.ALL);
    for ( i = 0; i < data.length; i++ )
    {
        ddata.push(["address", [ [ "city", data[i][10]], ["address", data[i][6]], ["zip", data[i][9]], ["country", data[i][14]] ] ]);
    }
    // Kommunkationsdaten
    data = a.getTableData("$comp.Table_comm", a.ALL);
    var medium = getKeyList( "PersMedium", ["KEYVALUE", "KEYNAME2"] );
    for ( i = 0; i < medium.length; i++ ) comm[medium[i][0]] = medium[i][1];
    for ( i = 0; i < data.length; i++ ) commdata.push([comm[data[i][2]], data[i][3] ] );
    if ( commdata.length > 0 )  ddata.push(["comm", commdata ] );
    return getPattern( ddata, param );
}

/*
 * Ermittelt das Dublettenkriterium für Frame QUICKINSERT
 *
 * @param {Array} pCommData req Kommunikationsdaten
 *
 * @return {String} das Dublettenkriterium
 */
function getOrgQuickPattern(pCommData)
{
    var ddata = [];
    var param = []; 
    var data = getKeyList( "DuplicateOrgPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
    for ( i = 0; i < data.length; i++ ) param[data[i][0]] = data[i];

    // Felder
    ddata.push(["orgname", a.valueof("$comp.orgname")]);
    ddata.push(["address", [ [ "city", a.valueof("$comp.city")], ["address", a.valueof("$comp.address")] ] ]);
    
    // Kommunkationsdaten    
    ddata.push(["comm", pCommData ] );    
    return getPattern( ddata, param );
}

/*
 * Ermittelt das Dublettenkriterium für Frame QUICKINSERTPERS
 *
 * @param {Array} pCommData req Kommunikationsdaten
 *
 * @return {String} das Dublettenkriterium
 */
function getPersQuickPattern(pCommData)
{
    var ddata = [];
    var param = []; 

    var data = getKeyList( "DuplicatePersPattern", ["KEYNAME1", "KEYNAME2", "KEYDETAIL", "KEYDESCRIPTION"], undefined, "AOACTIVE = 1" );
    for ( i = 0; i < data.length; i++ ) param[data[i][0]] = data[i];

    // Felder
    ddata.push(["salutation", a.valueof("$comp.salutation")]);
    ddata.push(["lastname", a.valueof("$comp.lastname")]);
    ddata.push(["firstname", a.valueof("$comp.firstname")]);
    ddata.push(["address", [ [ "city", a.valueof("$comp.city")], ["address", a.valueof("$comp.address")] ] ]);
    
    // Kommunkationsdaten
    ddata.push(["comm", pCommData ] );    
    return getPattern( ddata, param );
}

/*
 * Erzeugt den Pattern für die Indexsuche einer ORG.
 *
 * @param {Array} pData req der zu prüfende Frame
 * @param {Array} pParam req Parameter
 *
 * @return {String} Pattern 
 */
function getPattern( pData, pParam )
{
    var excision = [];
    var pattern = "";
    var part = "";
    var comm = [];
    var address = [];
    var fields = [];
    var element = [];
    var data = [];
    for ( var y = 0; y < pData.length; y++)
    {
        switch( pData[y][0] )
        {
            // Felder
            case "lastname":
            case "firstname":
            case "orgname":
                if ( pParam[pData[y][0]] != undefined)
                {
                    element = [];
                    excision = pParam[pData[y][0]][2].split(/\s+/);
                    part = pData[y][1].split(/[-\s+]/);
                    if ( part.length > 0 )
                    {
                        for ( p = 0; p < part.length; p++ )
                        {
                            part[p] = part[p].replace(/(^\s+)|(\s+$)/g,"");
                            if ( ! hasElement(excision, part[p], true ) )
                                if ( part[p] != "" && part[p].length > 1)   element.push( pData[y][0] + ":" + escapepattern(part[p]) + pParam[pData[y][0]][1] );
                        }
                        if ( element.length > 0 )  fields.push( "(" + element.join(" " + pParam[pData[y][0]][3] + " ") + ")" );
                    }
                }
                break;
            // Adressdaten
            case "address":
                data = pData[y][1];
                element = [];
                for ( p = 0; p < data.length; p++ )
                {
                    if( pParam[ data[p][0] ] != undefined )
                    {
                        part = data[p][1].replace(/(^\s+)|(\s+$)/g,"*");
                        if ( part != "" )
                        {
                            len = parseInt( pParam[data[p][0]][2] );
                            // wenn in Keyword <feld <description eine Zahl eingetragen wird die Adresse auf diese Länge abgeschnitten
                            if ( len != NaN && len > 0) part = element.push( data[p][0] + ":" + escapepattern(part.substr(0, len )) + "*" + pParam[data[p][0]][1] );
                            else element.push( data[p][0] + ":" + escapepattern(part) + pParam[data[p][0]][1] )
                        }   
                    }
                }
                if ( element.length > 0 )  address.push( " ( " + element.join(" AND ") + " ) " );
                break;
                
            // Kommunikationsdaten
            case "comm":
                data = pData[y][1];
                for ( p = 0; p < data.length; p++ )
                {
                    if( pParam[ data[p][0] ] != undefined )
                    {
                        if ( data[p][0] == "fon" || data[p][0] == "fax" )   
                        {    
                            element = "searchaddr";
                            part = cleanPhoneNumber(data[p][1]);
                        }
                        else
                        {
                            element = "addr";
                            part = data[p][1];                        
                        }
                        part = part.replace(/(^\s+)|(\s+$)/g,"");
                        if ( part != "" )  comm.push( element + ':"' + escapepattern(part) + '"' + pParam[data[p][0]][1])
                    }
                }
                break;
        }
    }
    if ( fields.length > 0 )  pattern += fields.join(" AND ");
    if ( address.length > 0 )  
    {
        if ( fields.length > 0 ) pattern += " AND ";
        pattern += " ( " + address.join(" OR ") + " ) ";
    }
    if ( comm.length > 0 )  pattern = "(" + pattern + ") OR " + comm.join(" OR ");
    return pattern;
    
    function escapepattern( pString )
    {
        var str = ["\\", "+", "-", "&&", "||", "!", "(", ")", "{", "}", "[", "]", "^", '"', "~", "*", "?", ":", "–", "«", "»", "„", "”", "“", "/"]; 
        for ( var i = 0; i < str.length; i++)  pString = pString.replace( str[i], "\\" + str[i], "g");
        return( pString.toLowerCase() );
    }
}
	
/*
* Holt die Dubletten für Dublettenliste.
*
* @param {String} pFrame req der Frame für den die Dubletten geholt werden sollen
* @param {String []} pDupIds req die Ids der Dubletten als Array
*
* @return {[]} die Dubletten
*/
function getDuplicates(pFrame, pDupIds)
{
    var duplicates = "";
    switch (pFrame)
    {
        case "ORG":
            duplicates = getDuplicatesOrg(pDupIds);
            break;
        case "PERS":
            duplicates = getDuplicatesPers(pDupIds);
            break;
    }
	
    return duplicates;
}
/*
* Holt die Dubletten für eine Firma.
*
* @param {[]} pDupIds req die Ids der Dubletten als Array
*
* @return {String [}] die Dubletten
*/
function getDuplicatesOrg(pDupIds)
{
    var tab = [];
    if (pDupIds != "")
    {
        var condition =  " where RELATION.PERS_ID is null and RELATIONID in ('" + pDupIds.join("','") + "')";
        //        + " and RELATIONID not in (select RELATION1_ID from NODUPLICATE) and RELATIONID not in (select RELATION2_ID from NODUPLICATE)";
        var sql = "select RELATIONID, ORGNAME, COUNTRY, "
        + " ZIP, CITY, " + concat( new Array("ADDRESS", "BUILDINGNO") ) + ", " + getKeySQL("RELSTATUS", "RELATION.STATUS")
        + " from ORG join RELATION on ORGID = RELATION.ORG_ID join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID";
        tab = a.sql(sql + condition, a.SQL_COMPLETE);
    }
    return tab;
}

/*
* Holt die Dubletten für eine Person.
*
* @param {String []} pDupIds req die Ids der Dubletten als Array
*
* @return {String []} mit den IDs der Dubletten
*/
function getDuplicatesPers(pDupIds)
{
    var tab = [];
    if (pDupIds != "")
    {
        var condition = " where RELATION.PERS_ID is not null and RELATIONID in ('" + pDupIds.join("','") + "')";
        //        + " and RELATIONID not in (select RELATION1_ID from NODUPLICATE) and RELATIONID not in (select RELATION2_ID from NODUPLICATE)";
        var sql = "select RELATIONID, ORGNAME, " + concat(new Array("SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME")) 
        + ", COUNTRY, ZIP, CITY, " + concat( new Array("ADDRESS", "BUILDINGNO") ) + ", " + getKeySQL("RELSTATUS", "RELATION.STATUS")
        + " from RELATION join PERS on PERSID = RELATION.PERS_ID join ORG on ORGID = RELATION.ORG_ID"
        + " join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID";
        tab = a.sql(sql + condition, a.SQL_COMPLETE);
    }
    return tab;
}

/*
* merged eine Org mit der anderen
* 
* @param {String} pOldRelID req Relationid
* @param {String} pNewRelID req Relationid
*
* @return {void}
*/
function mergeOrg( pOldRelID, pNewRelID )
{
    var statements = new Array();
    var oldorgid = a.sql("select ORG_ID from RELATION where PERS_ID is null and RELATIONID = '" + pOldRelID + "'");
    var neworgid = a.sql("select ORG_ID from RELATION where PERS_ID is null and RELATIONID = '" + pNewRelID + "'");

    statements.push(setStatements( "RELATION", "ORG_ID", oldorgid, neworgid, "PERS_ID is not null"));
    statements.push(setStatements( "HISTORYLINK", "ROW_ID", pOldRelID, pNewRelID, "OBJECT_ID = 1"));
    statements.push(setStatements( "ATTRLINK", "ROW_ID", pOldRelID, pNewRelID, "OBJECT_ID = 1"));
    statements.push(["COMM", ["STANDARD"], a.getColumnTypes("COMM", ["STANDARD"]), ["0"], "RELATION_ID = '" + pOldRelID + "'"]);
    statements.push(setStatements( "COMM", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "TABLEACCESS", "ROW_ID", pOldRelID, pNewRelID, "FRAME_ID = 1" ));
    statements.push(setStatements( "ASYS_BINARIES", "ROW_ID", pOldRelID, pNewRelID, "TABLENAME = 'RELATION'" ));
    statements.push(setStatements( "ASYS_CALENDARLINK", "DBID", pOldRelID, pNewRelID, "FRAME = 'comp.ORG'" ));
    statements.push(setStatements( "OFFER", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "SALESORDER", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "SALESPROJECT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "PROPINV", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "QUESTIONNAIRELOG", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "ADVERTISINGSHIPMENT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "BANKACCOUNT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "COMPLAINT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "CONTRACT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "EQUIPMENTINVENTORY", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "ADDRESS", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(["RELATION", ["STATUS"], a.getColumnTypes("RELATION",["STATUS"]), ["1"], "RELATIONID = '" + pNewRelID + "'"]);
    
    statements = statements.concat(setStatements4Participant( "EVENTPARTICIPANT", "RELATION_ID", "EVENT_ID", pOldRelID, pNewRelID ));
    statements = statements.concat(setStatements4Participant( "CAMPAIGNPARTICIPANT", "RELATION_ID", "CAMPAIGN_ID", pOldRelID, pNewRelID ));
    statements = statements.concat(setStatements4Participant( "DISTLISTMEMBER", "RELATION_ID", "DISTLIST_ID", pOldRelID, pNewRelID ));

    if ( oldorgid != neworgid) statements.push(["ORG", "ORGID = '" + oldorgid + "'"]);	
    statements.push(["RELATION", "ORG_ID = '" + oldorgid + "'"]);
 
    try
    {
        a.sqlMix( statements );
    }
    catch(err)
    {
        log.show(err);			
    }
    return ( a.translate("gelöschte ORGID ='%0',\ngelöschte RELATIONID = '%1'", [oldorgid, pOldRelID]) )
}

/*
* merged eine PERS mit der anderen
*
* @param {String} pOldRelID req Relationid
* @param {String} pNewRelID req Relationid
*
* @return {void}
*/
function mergePers( pOldRelID, pNewRelID )
{
    var statements = new Array();

    var oldpersid = a.sql("select PERS_ID from RELATION where RELATIONID = '" + pOldRelID + "'");
    var newpersid = a.sql("select PERS_ID from RELATION where RELATIONID = '" + pNewRelID + "'");

    statements.push(setStatements( "OBJECTRELATION", "SOURCE_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "OBJECTRELATION", "DEST_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "HISTORYLINK", "ROW_ID", pOldRelID, pNewRelID, "OBJECT_ID in (2,3)"));
    statements.push(["COMM", ["STANDARD"], a.getColumnTypes("COMM", ["STANDARD"]), ["0"], "RELATION_ID = '" + pOldRelID + "'"]);
    statements.push(setStatements( "COMM", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "ATTRLINK", "ROW_ID", pOldRelID, pNewRelID, "OBJECT_ID in (2,3)"));
    statements.push(setStatements( "TABLEACCESS", "ROW_ID", pOldRelID, pNewRelID, "FRAME_ID = 2" ));
    statements.push(setStatements( "ASYS_BINARIES", "ROW_ID", pOldRelID, pNewRelID, "TABLENAME = 'RELATION'" ));
    statements.push(setStatements( "ASYS_CALENDARLINK", "DBID", pOldRelID, pNewRelID, "FRAME = 'comp.PERS'" ));
    statements.push(setStatements( "OFFER", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "SALESORDER", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "SALESPROJECT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "PROPINV", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "QUESTIONNAIRELOG", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "ADVERTISINGSHIPMENT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "BANKACCOUNT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "COMPLAINT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "CONTRACT", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "EQUIPMENTINVENTORY", "RELATION_ID", pOldRelID, pNewRelID ));
    statements.push(setStatements( "ADDRESS", "RELATION_ID", pOldRelID, pNewRelID ));
    
    statements = statements.concat(setStatements4Participant( "EVENTPARTICIPANT", "RELATION_ID", "EVENT_ID", pOldRelID, pNewRelID ));
    statements = statements.concat(setStatements4Participant( "CAMPAIGNPARTICIPANT", "RELATION_ID", "CAMPAIGN_ID", pOldRelID, pNewRelID ));
    statements = statements.concat(setStatements4Participant( "DISTLISTMEMBER", "RELATION_ID", "DISTLIST_ID", pOldRelID, pNewRelID ));
 
    statements.push(["RELATION", ["STATUS"], a.getColumnTypes("RELATION",["STATUS"]), ["1"], "RELATIONID = '" + pNewRelID + "'"]);

    if ( oldpersid != newpersid) statements.push(["PERS", "PERSID = '" + oldpersid + "'"]);	
    statements.push(["RELATION", "PERS_ID = '" + oldpersid + "'"]);	

    try
    {
        a.sqlMix( statements );
    }
    catch(err)
    {
        log.show(err);			
    }
    return ( a.translate("gelöschte PERSID ='%0',\ngelöschte RELATIONID = '%1'", [oldpersid, pOldRelID]) )
}

/*
* Erzeugt die Statements zur Zusammenführung von Tabellen die nur einmal wie Campaign
*
* @param {String} pTable req Tabellenname
* @param {String} pColumn req Spaltenname
* @param {String} pColumnIN req Spaltenname z.B. ID der CAMPAIGN_ID
* @param {String} poldValue req alter Wert
* @param {String} pnewValue req neuer Wert
* 
* @return {[[]]}	Statements
*/
function setStatements4Participant( pTable, pColumn, pColumnIN, poldValue, pnewValue )
{
    var ret = []; 
    ret.push([ pTable, [pColumn], a.getColumnTypes( pTable, [pColumn] ), [pnewValue], pColumnIN 
        + " not in (select " + pColumnIN + " from " + pTable + " where " + pColumn + " = '" 
        + pnewValue + "') and " + pColumn + " = '" + poldValue + "'"]);
    
    ret.push([ pTable, pColumnIN + " in (select " + pColumnIN + " from " + pTable + " where " 
        + pColumn + " = '" + pnewValue + "') and " + pColumn + " = '" + poldValue + "'"]);    
    return ret;
}

/*
 * Erzeugt Statements.
*
* @param {String} pTable req Tabellenname
* @param {String} pColumn req Spaltenname
* @param {String} poldValue req alter Wert
* @param {String} pnewValue req neuer Wert
* @param {String} pCondition opt Condition
* 
* @return {[[]]}	Statements
*/
function setStatements( pTable, pColumn, poldValue, pnewValue, pCondition )
{
    var condition = pColumn + " = '" + poldValue + "'";
    if ( pCondition != undefined && pCondition != "") condition += " and ( " + pCondition + ") "; 
    var ret =	[ pTable, [pColumn], a.getColumnTypes( pTable, [pColumn] ), [pnewValue], condition ];
    return ret;
}

/*
* Fügt in die Tabelle NODUPLICATES somit sind Dubletten als 'keine Dubletten'  gekennzeichnet.
*
* @param {String} pRelationID1 req 
* @param {String} pRelationID2 req 
*
* @return void
*/
function noduplicate (pRelationID1, pRelationID2)
{
    if (pRelationID1 != '' && pRelationID2 != '')
    {
        var col = ["NODUPLICATEID", "RELATION1_ID", "RELATION2_ID", "DATE_NEW", "USER_NEW"];
        var typ = a.getColumnTypes("NODUPLICATE", col)
        a.sqlInsert("NODUPLICATE", col, typ, [a.getNewUUID(), pRelationID1, pRelationID2, a.valueof("$sys.date"), a.valueof("$sys.user")])
    }
    return;
}