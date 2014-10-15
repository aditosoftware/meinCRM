import("lib_attr");
import("lib_keyword");
import("lib_telephony");
import("lib_themetree");
import("lib_sql");
import("lib_duplicate");

/*
 * Erstellt einen neuen Firmendatensatz in der Datenbank
 *
 * @param [] pFramedata req 
 *  
 */
function quickinsertORG( pFramedata )
{
    var statements = [];

    //IDs
    pFramedata["ORGID"]  = a.getNewUUID();
    pFramedata["ORG_ID"]  = pFramedata["ORGID"];
    pFramedata["ADDRESSID"]  = a.getNewUUID();
    pFramedata["ADDRESS_ID"]  = pFramedata["ADDRESSID"];
    pFramedata["RELATIONID"]  = a.getNewUUID();
    pFramedata["ORGRELID"] = pFramedata["RELATIONID"];
    a.imagevar("$image.relorgid",  pFramedata["RELATIONID"]);
    pFramedata["RELATION_ID"]  = pFramedata["RELATIONID"];
    pFramedata["ADDR_TYPE"] = "1";
    pFramedata["STANDARD"] = "1";
    pFramedata["STATUS"] = "1";
   
    //ORG
    var fields = ["ORGID", "ORGNAME", "DATE_NEW", "USER_NEW"];
    var types = a.getColumnTypes("ORG", fields);
    statements.push(["ORG", fields, types, getColumnValues(fields, pFramedata)]);
  
    //Org-Relation
    fields =  ["RELATIONID","ORG_ID", "ADDRESS_ID", "LANG", "STATUS", "SOURCE" ,"DATE_NEW", "USER_NEW"]; 
    types = a.getColumnTypes("RELATION", fields);
    statements.push(["RELATION", fields, types, getColumnValues(fields, pFramedata)]);
 
    //Adresse Firma
    fields = new Array("ADDRESSID", "RELATION_ID", "ADDR_TYPE", "ADDRESS", "BUILDINGNO", "ZIP", "CITY", "COUNTRY", "DATE_NEW", "USER_NEW");
    types = a.getColumnTypes( "ADDRESS", fields);
    statements.push(["ADDRESS", fields, types, getColumnValues(fields, pFramedata)]);
       
    // ORG Attribute
    if (pFramedata["BRANCHE"] != '') setAttribute( a.sql("select ATTRID from ATTR where ATTRNAME = 'Branche'"), pFramedata["BRANCHE"], pFramedata["RELATIONID"], "1" );
    if (pFramedata["ZIELGRUPPE"] != '') setAttribute( a.sql("select ATTRID from ATTR where ATTRNAME = 'Zielgruppe'"), pFramedata["ZIELGRUPPE"], pFramedata["RELATIONID"], "1" );
    if (pFramedata["SALESMANAGER"] != '') setAttribute( a.sql("select ATTRID from ATTR where ATTRNAME = 'Aussendienst'"),pFramedata["SALESMANAGER"], pFramedata["RELATIONID"], "1" ); 
  
    // COMM-Daten zu Firma anlegen
    fields = ["COMMID", "RELATION_ID", "MEDIUM_ID", "ADDR", "STANDARD", "DATE_NEW", "USER_NEW", "SEARCHADDR"];
    types = a.getColumnTypes("COMM", fields);
   
    if(pFramedata["TELEFON"] != "" && pFramedata["LASTNAME"] == "")
    {
        pFramedata["COMMID"] = a.getNewUUID();
        pFramedata["ADDR"] = pFramedata["TELEFON"];
        pFramedata["MEDIUM_ID"] = "1";
        pFramedata["SEARCHADDR"] = getSearchAddr( "1",  pFramedata["ADDR"]);
        statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); //TelefonFirma
    }

    if(pFramedata["FAX"] != "")
    {
        pFramedata["COMMID"] = a.getNewUUID();
        pFramedata["ADDR"] = pFramedata["FAX"];
        pFramedata["MEDIUM_ID"] = "2";
        pFramedata["SEARCHADDR"] = getSearchAddr( "2",  pFramedata["ADDR"]);
        statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); //TelefonFirma
    }

    if (pFramedata["EMAIL"] != "" && pFramedata["LASTNAME"] == "") 
    {
        pFramedata["COMMID"] = a.getNewUUID();
        pFramedata["ADDR"] = pFramedata["EMAIL"];
        pFramedata["MEDIUM_ID"] = "3";
        pFramedata["SEARCHADDR"] = "";
        statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); //EmailFirma
    }

    if (pFramedata["INTERNET"] != "") 
    {
        pFramedata["COMMID"] = a.getNewUUID();
        pFramedata["ADDR"] = pFramedata["INTERNET"];
        pFramedata["MEDIUM_ID"] = "4"
        pFramedata["SEARCHADDR"] = "";
        statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); // InternetFirma  
    }

    a.sqlInsert(statements);
    if ( a.hasvar("$image.nodupOrg"))
    {
        var nodupOrg = a.valueofObj("$image.nodupOrg");
        for ( var i = 0; i < nodupOrg.length; i++)   noduplicate(pFramedata["RELATIONID"], nodupOrg[i]);
    }
    return pFramedata;
}
 
/*
 * Erstellt neue Personendatensatz in der Datenbank
 *
 * @param [] pFramedata req 
 *  
 */
function quickinsertPERS( pFramedata )
{
    var statements = [];

    if (pFramedata["PERSID"] == undefined) 
    {
        pFramedata["PERSID"] = a.getNewUUID(); //Neue Person mit neuer ID anlegen
    
        var fields = ["PERSID", "SALUTATION", "TITLE", "FIRSTNAME", "LASTNAME", "DATE_NEW", "USER_NEW"];
        var types = a.getColumnTypes("PERS", fields);
        statements.push(["PERS", fields, types, getColumnValues(fields, pFramedata)]);
    }
    
    pFramedata["STATUS"] = "1";
    pFramedata["PERS_ID"] = pFramedata["PERSID"];
    pFramedata["PERSRELID"] = a.sql("select RELATIONID from RELATION where ORG_ID = '" + pFramedata["ORGID"] + "' and PERS_ID = '" + pFramedata["PERSID"] + "'"); 
    pFramedata["STANDARD"] = "1";
    pFramedata["ADDR_TYPE"] = "1";
    
    if( pFramedata["PERSRELID"] == "") 
    {
        if ( pFramedata["ORGID"] == "0") //Eine Privatperson
        {
            pFramedata["RELATIONID"] = a.getNewUUID();
            pFramedata["RELATION_ID"] = pFramedata["RELATIONID"];
            pFramedata["PERSRELID"] = pFramedata["RELATIONID"];
            pFramedata["ADDRESSID"] = a.getNewUUID();
            pFramedata["ADDRESS_ID"] = pFramedata["ADDRESSID"];
            pFramedata["ORG_ID"] = pFramedata["ORGID"];
            //Relation
            fields =  ["RELATIONID", "ORG_ID", "PERS_ID", "ADDRESS_ID", "LANG", "SOURCE" ,"DATE_NEW", "USER_NEW"]; 
            types = a.getColumnTypes("RELATION", fields);
            statements.push(["RELATION", fields, types, getColumnValues(fields, pFramedata)]);
 
            //Adresse
            fields = new Array("ADDRESSID", "RELATION_ID", "ADDR_TYPE", "ADDRESS", "BUILDINGNO", "ZIP", "CITY", "COUNTRY", "DATE_NEW", "USER_NEW");
            types = a.getColumnTypes( "ADDRESS", fields);
            statements.push(["ADDRESS", fields, types, getColumnValues(fields, pFramedata)]);
   
        }
        else //Person in Firma
        {
            // Pers-Relation
            pFramedata["PERSRELID"] = a.getNewUUID();
            fields = ["RELATIONID", "ORG_ID", "PERS_ID", "ADDRESS_ID", "STATUS", "LANG", "SOURCE", "DEPARTMENT", "RELTITLE", "DATE_NEW", "USER_NEW"];
            types = a.getColumnTypes("RELATION", fields);
            pFramedata["RELATIONID"] = pFramedata["PERSRELID"];
            statements.push(["RELATION", fields, types, getColumnValues(fields, pFramedata)]);
        }
        a.imagevar("$image.relpersid",  pFramedata["PERSRELID"]);
        //COMM-Daten zu Person anlegen
        fields = ["COMMID", "RELATION_ID", "MEDIUM_ID", "ADDR", "STANDARD", "DATE_NEW", "USER_NEW", "SEARCHADDR"];
        types = a.getColumnTypes("COMM", fields);

        pFramedata["RELATION_ID"] = pFramedata["PERSRELID"];
        if(pFramedata["TELEFON"] != "" )
        {
            pFramedata["COMMID"] = a.getNewUUID();
            pFramedata["ADDR"] = pFramedata["TELEFON"];
            pFramedata["MEDIUM_ID"] = "1";
            pFramedata["SEARCHADDR"] = getSearchAddr( "1",  pFramedata["ADDR"]);
            statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); //Telefon
        }
        if(pFramedata["FAX"] != "" && pFramedata["ORGID"] == "0")
        {
            pFramedata["COMMID"] = a.getNewUUID();
            pFramedata["ADDR"] = pFramedata["FAX"];
            pFramedata["MEDIUM_ID"] = "2";
            pFramedata["SEARCHADDR"] = getSearchAddr( "2",  pFramedata["ADDR"]);
            statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); //Fax
        }
        if (pFramedata["EMAIL"] != "" ) 
        {
            pFramedata["COMMID"] = a.getNewUUID();
            pFramedata["ADDR"] = pFramedata["EMAIL"];
            pFramedata["MEDIUM_ID"] = "3";
            pFramedata["SEARCHADDR"] = "";
            statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); //Email
        }
        if (pFramedata["INTERNET"] != "" && pFramedata["ORGID"] == "0") 
        {
            pFramedata["COMMID"] = a.getNewUUID();
            pFramedata["ADDR"] = pFramedata["INTERNET"];
            pFramedata["MEDIUM_ID"] = "4"
            pFramedata["SEARCHADDR"] = "";
            statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); // Internet  
        }
        if(pFramedata["MOBIL"] != "")
        {
            pFramedata["COMMID"] = a.getNewUUID();
            pFramedata["ADDR"] = pFramedata["MOBIL"];
            pFramedata["MEDIUM_ID"] = "5";
            pFramedata["SEARCHADDR"] = getSearchAddr( "5",  pFramedata["ADDR"]);
            statements.push(["COMM", fields, types, getColumnValues(fields, pFramedata)]); //Mobil
        }
    }
    a.sqlInsert(statements);
    if( a.hasvar("$image.nodupPers") )
    { 
        var nodupPers = a.valueofObj("$image.nodupPers");
        for ( var i = 0; i < nodupPers.length; i++)   noduplicate(pFramedata["PERSID"], nodupPers[i]);
    }
    return pFramedata;
}   
    
/*
 *Erzeugt neuen Vertriebsprojekt-Datensatz in der Datenbank
 *
 * @param [] pFramedata req 
 */

function quickinsertSALESPROJECT(pFramedata)
{
    var statements = [];
    //Salesproject
    pFramedata["SALESPROJECTID"] = a.getNewUUID();  
    pFramedata["PHASE"] = "1";
    pFramedata["STATUS"] = "1";
    pFramedata["VOLUME"] = "0";
    pFramedata["PROJECTTITLE"] = pFramedata["ORGNAME"];
    pFramedata["STARTDATE"] = a.valueof("$sys.date");
    pFramedata["PROBABILITY"] = "0";
    pFramedata["PROJECTNUMBER"] = a.sql("select max(PROJECTNUMBER) + 1 from SALESPROJECT");
    //SPSources
    pFramedata["SPSOURCESID"] = a.getNewUUID();
    pFramedata["SALESPROJECT_ID"] = pFramedata["SALESPROJECTID"];
    pFramedata["ENTRYDATE"] = a.valueof("$sys.date");
    pFramedata["INFO"] = "Initialeintrag";
    pFramedata["SOURCE"] = pFramedata["SOURCEKEY"];
    //SPCycle
    pFramedata["KEYVAL"] = "1";
    pFramedata["DAYS"] = "0";
    //SPMember
    pFramedata["SPMEMBERID"] = a.getNewUUID();
    pFramedata["SALESPROJECTROLE"] = "1";
  
    pFramedata["RELATION_ID"] = pFramedata["ORGRELID"];
    var fields = ["SALESPROJECTID", "RELATION_ID", "PHASE", "STATUS", "VOLUME", "PROJECTTITLE", "STARTDATE", "PROBABILITY", "PROJECTNUMBER", "DATE_NEW", "USER_NEW"];
    var types = a.getColumnTypes("SALESPROJECT", fields);
    statements.push(["SALESPROJECT", fields, types, getColumnValues(fields, pFramedata)]);
       
    fields = ["SPSOURCESID", "SALESPROJECT_ID", "ENTRYDATE", "SOURCE", "INFO", "DATE_NEW", "USER_NEW"];
    types = a.getColumnTypes("SPSOURCES", fields);
    statements.push(["SPSOURCES", fields, types, getColumnValues(fields, pFramedata)]);
        
    fields = new Array("SPCYCLEID", "SALESPROJECT_ID", "ENTRYDATE", "STATUSPHASE", "KEYVAL", "DAYS", "DATE_NEW", "USER_NEW");
    types = a.getColumnTypes("SPCYCLE", fields);
         
    pFramedata["STATUSPHASE"] = 'Status';
    pFramedata["SPCYCLEID"] = a.getNewUUID();
    statements.push(["SPCYCLE", fields, types, getColumnValues(fields, pFramedata)]);
    
    pFramedata["STATUSPHASE"] = 'Phase';
    pFramedata["SPCYCLEID"] = a.getNewUUID();
    statements.push(["SPCYCLE", fields, types, getColumnValues(fields, pFramedata)]);
        
    if (pFramedata["PROJEKTART"] != '') setAttribute( a.sql("select ATTRID from ATTR where ATTRNAME = 'Projektart'"), pFramedata["PROJEKTART"], pFramedata["SALESPROJECTID"], "16" );
    
    // Salesmanager anlegen
    if (pFramedata["SALESMANAGER"] != '')
    {
        pFramedata["RELATION_ID"] = pFramedata["SALESMANAGER"];
        fields = ["SPMEMBERID", "SALESPROJECT_ID", "RELATION_ID", "SALESPROJECTROLE", "DATE_NEW", "USER_NEW"];
        types = a.getColumnTypes("SPMEMBER", fields);
        statements.push(["SPMEMBER", fields, types, getColumnValues(fields, pFramedata)]);
    }
    a.sqlInsert(statements);
    return pFramedata;
}

/*
 * Erzeugt neuen Historiendatensatz in der Datenbank
 *
 * @param [] pFramedata req 
 *  
 */ 

function quickinsertHistory(pFramedata)
{   
    var statements = [];
    
    pFramedata["HISTORYID"] = a.getNewUUID();
    pFramedata["HISTORY_ID"] = pFramedata["HISTORYID"];
    pFramedata["RELATION_ID"] = a.valueof("$global.user_relationid");
    pFramedata["ENTRYDATE"] = a.valueof("$sys.date");

    var fields = ["HISTORYID", "RELATION_ID", "ENTRYDATE", "MEDIUM", "DIRECTION", "SUBJECT", "INFO", "DATE_NEW", "USER_NEW"];
    var types = a.getColumnTypes("HISTORY", fields);
    if ( pFramedata["INFO"] == null) pFramedata["INFO"] = "";
    statements.push(["HISTORY", fields, types, getColumnValues(fields, pFramedata)]);
        
    fields = ["HISTORYLINKID", "HISTORY_ID", "ROW_ID", "OBJECT_ID", "DATE_NEW", "USER_NEW"];
    types = a.getColumnTypes("HISTORYLINK", fields);
    if(pFramedata["ORGRELID"] != undefined)
    {
        pFramedata["HISTORYLINKID"] = a.getNewUUID();
        pFramedata["ROW_ID"] = pFramedata["ORGRELID"];
        pFramedata["OBJECT_ID"] = "1";
        statements.push(["HISTORYLINK", fields, types, getColumnValues(fields, pFramedata)]);
    }

    if (pFramedata["PERSRELID"] != undefined)
    {
        pFramedata["HISTORYLINKID"] = a.getNewUUID();
        pFramedata["ROW_ID"] = pFramedata["PERSRELID"];
        if(pFramedata["ORGID"] == "0")
        {
            pFramedata["OBJECT_ID"] = "2";  //Historienverknüpfung für Privatperson
        }
        else 
        {
            pFramedata["OBJECT_ID"] = "3"; //Historienverknüpfung für Person in Firma
        }
        statements.push(["HISTORYLINK", fields, types, getColumnValues(fields, pFramedata)]);
    }
    if ( pFramedata["SALESPROJECTID"] != undefined ) // Vertriebsprojekt
    {
        pFramedata["HISTORYLINKID"] = a.getNewUUID();
        pFramedata["ROW_ID"] = pFramedata["SALESPROJECTID"];
        pFramedata["OBJECT_ID"] = "16";
        statements.push(["HISTORYLINK", fields, types, getColumnValues(fields, pFramedata)]);
    }
    // Themenbau eintragen
    var HistoryThemeIDs = [];
    var val = a.getTableData("$comp.tblThemen", a.ALL);
    if (val.length > 0)
    {
        fields = ["HISTORY_THEMEID", "THEME_ID", "THEME", "HISTORY_ID", "DATE_NEW", "USER_NEW"];
        types = a.getColumnTypes("HISTORY_THEME", fields);
        for (i=0; i < val.length; i++)
        {
            if (val[i][2] == null) val[i][2] = "";
            statements.push(["HISTORY_THEME", fields, types, [val[i][0], val[i][1], val[i][2], pFramedata["HISTORYID"], pFramedata["DATE_NEW"], pFramedata["USER_NEW"]]]);
            HistoryThemeIDs.push(val[i][0]);
        }            
    }
    a.sqlInsert(statements);

    // Wiedervorlage-Aufgabe setzen wenn im Themenbaum für die eingetragenen Themen ein Reminder gestezt ist !!,    
    if ( HistoryThemeIDs.length > 0 )    setreminder(HistoryThemeIDs);
    return pFramedata;
}


/*
 * Überprüft ob zu den angegebenen Feldern Werte da sind und liest diese aus
 * 
 * @param [] pFieldNames req
 * @param [] pFieldValues req
 */
function getColumnValues(pFieldNames, pFieldValues)
{
    var values = [];
    for(var i = 0; i< pFieldNames.length; i++)
    {
        values.push(pFieldValues[pFieldNames[i]]);
    }
    return values;
}

/*
 * Erzeugt neuen Objektdatensatz in der Datenbank
 *
 * @param [] pFramedata req 
 *  
 */ 
function quickinsertPROPINV(pFramedata)
{
    if ( a.hasvar("$image.propinvrole") && a.hasvar("$image.propertyid") )
    {
        var fields = ["PROPINVID", "PROPERTY_ID", "RELATION_ID", "ROLEINVOLVED", "USER_NEW", "DATE_NEW"];
        var types = a.getColumnTypes("PROPINV", fields);
        var values = [ a.getNewUUID(), a.valueof("$image.propertyid"), pFramedata["ORGRELID"], 
        a.valueof("$image.propinvrole"), a.valueof("$sys.user"), a.valueof("$sys.date") ];
        if ( isDuplicat("PROPINV", fields, types, values) == 0 )    a.sqlInsert("PROPINV", fields, types, values);            
    }
}