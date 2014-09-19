import("lib_keyword");
import("lib_sql");
import("lib_grant");

/*
* Gibt den Type der Relation zurück. 1=Organisation, 2=Privatperson, 3=Person einer Organisation
*
* @param {String} pRelationID req Id der Relation
*
* @return {Integer} Type der Relation
*/
function getRelationType(pRelationID)
{
    var type = "";
    var relation = a.sql("select PERS_ID, ORG_ID from RELATION where RELATIONID = '" + pRelationID + "'", a.SQL_ROW);
    if ( relation.length > 0 )
    {
        if ( relation[0] == "" )
        {
            type = 1;  // Organisation da PERS_ID leer
        }
        else
        {
            if ( relation[1].replace(/\s/g,"") == "0" )
            {
                type = 2; // Privatperson da PERS_ID nicht leer und trim(ORG_ID) = '0' 
            }	
            else type = 3; // Person einer Organisation da PERS_ID nicht leer und ORG_ID nicht '0'  
        }
    }
    return type;
}

/*
* Gibt den SQLString für die zurück.
*
* @param {String} pTable req Name der Tabelle
* @param {String} pCondition req Bedingung
*
* @return {String} PersRelID
*/
function getRelationSQLString( pTable, pCondition ) 
{
    if ( pCondition != "" && pCondition != undefined ) 	pCondition = " where " + pCondition;
    var sqlstr =  "select RELATIONID from RELATION join " + pTable + " on RELATION." + pTable + "_ID = " + pTable + "." + pTable + "ID ";
    if ( pCondition != "" && pCondition != undefined ) 	sqlstr += " where " + pCondition;
    return sqlstr;
}

/*
* Gibt die richtige Relationsids der aktuellen Selection zurück.
*
* @param {String} condition req Bedingung
*
* @return {String} PersRelID
*/
function GetPersRelIDs(condition)
{
    if ( condition != "" ) 	condition = " and " + condition;
    var relations =  a.sql("select RELATIONID from PERS join RELATION on (RELATION.PERS_ID = PERS.PERSID) join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID where STATUS = 1 " + condition, a.SQL_COLUMN);
    return relations;
}

/*
* Gibt die CommAddresses der aktuellen Selection zurück.
* 
* @param {String []} pCondition req Bedingung / Relationids
* @param {String} pCommType opt fon, fax oder mail
*
* @return {[]} mit CommAdressen
*/
function getCommAddresses(pCondition, pCommType)
{
    if ( pCommType == undefined )  pCommType = "mail";
    var addresses = [];
    if ( typeof(pCondition) == "object" )		pCondition = "RELATIONID in ('" + pCondition.join("', '") + "')";
    if ( pCondition != "" ) pCondition = " and (" + pCondition + ")"
    var data = a.sql(" select RELATIONID, ADDR from COMM join RELATION on RELATIONID = COMM.RELATION_ID  "
        + " join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID join ORG on ORGID = RELATION.ORG_ID left join PERS on PERSID = RELATION.PERS_ID "
        + " where MEDIUM_ID in (select KEYVALUE from KEYWORD where KEYNAME2 = '" + pCommType + "' and KEYTYPE = "
        + " (select KEYVALUE from KEYWORD where KEYNAME2 = case when RELATION.PERS_ID is NULL then 'OrgMedium' else 'PersMedium' end and KEYTYPE = 0 ))"
        + pCondition + " order by RELATIONID, COMM.STANDARD desc", a.SQL_COMPLETE);

    if ( data.length > 0 )
    {
        var relid = data[0][0];
        var addr = data[0][1];
        for ( var ri = 0; ri < data.length; ri++ )
        {
            if (relid != data[ri][0]) 	
            {
                addresses.push(addr);
                relid = data[ri][0];
                addr = data[ri][1];
            }
        }
        addresses.push(addr);
    }
    return addresses;
}


/*
* Gibt den FROM-String der LookUp-Komponente für Kontakte zurück
* 
* @return {String}
*/
function getContactFromString()
{
    var str = "RELATION join ORG on ORG.ORGID = RELATION.ORG_ID"
    + " left join PERS on PERS.PERSID = RELATION.PERS_ID"
    + " left join ADDRESS on ADDRESS.ADDRESSID = RELATION.ADDRESS_ID";

    return str;
}

/*

* Gibt den Where-String der LookUp-Komponente für Kontakte zurück
*
* @param {String} pWhereStr opt Where-String der LookUp-Komponente für Kontakte
* 
* @return {String}
*/
function getContactWhereString(pWhereStr)
{
    if ( pWhereStr == undefined )	pWhereStr = "RELATION.STATUS = 1";
    var condition = getGrantCondition("PERS", pWhereStr) 
    return condition;
}

/*
* Gibt den Select-String für die LookUp-Komponente für ORGPERS zurück
*
* @return {String}
*/
function getContactSelectORGPERSString()
{
    var str = "RELATIONID," 
    + concat( [ concat(["SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME"]) , "ORGNAME"], " - " ) +  " as anzeige, "
    + "CUSTOMERCODE, ORGNAME, ZIP, CITY, TITLE, FIRSTNAME, LASTNAME, RELTITLE"; 
    return str;
}

/*

* Gibt den Select-String für die LookUp-Komponente für ORG zurück
*
* @return {String}
*/
function getContactSelectORGString()
{
    var str = "RELATIONID, ORGNAME as anzeige, CUSTOMERCODE, ORGNAME, ZIP, CITY"; 
    return str;
}

/*
* Gibt die Condition für das Werbeverbot zurück
*
* @param {String []} pCondition req Bedingung / Relationids
* @param {Integer} pMedium req
*
* @return {String}
*/
function getCommRestrictionCondition( pCondition, pMedium )
{
    var condition = "RELATION.RELATIONID not in ( select RELATION_ID from COMMRESTRICTION where MEDIUM = " + pMedium + " )"
    + " and RELATION.ORG_ID not in ( select ORG_ID from RELATION join COMMRESTRICTION on RELATION_ID = RELATIONID and PERS_ID is null and MEDIUM = " + pMedium + " )";

    if ( typeof(pCondition) == "object" )		condition = " RELATION.RELATIONID in ('" + pCondition.join("', '") + "') and " + condition;
    else condition = "(" + pCondition + ") and " + condition;
    return condition;
}

/*
* Gibt den Wert eines Keywords abhänging eines Attributes in Organisation/Person zurück
*
* @param {String} pAttrName req Id , a.valueof(orgid) oder persid
* @param {String} pRelationID req ID der Relation
* 
* @return {Integer} Keyvalue
*/
function getRelAttr( pAttrName, pRelationID)
{
    var reltype = getRelationType(pRelationID);
    if ( reltype > 2 ) reltype = 2;

    var attrvalue = GetAttributeKey( pAttrName, reltype, pRelationID );
    if ( attrvalue == "" )
    {
        pRelationID = a.sql("select RELATIONID from RELATION where PERS_ID is null and ORG_ID = (select ORG_ID from RELATION where RELATIONID = '" + pRelationID + "')");
        attrvalue = GetAttributeKey( pAttrName, 1, pRelationID );
    }
    if ( attrvalue.length > 0 ) 	attrvalue = parseInt(attrvalue[0]);
    else attrvalue = 1;
    return attrvalue;
}