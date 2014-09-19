import("lib_history");
import("lib_duplicate");
import("lib_sql");
import("lib_telephony");

/*
* Verarbeitet einen Importsatz.
*
* @param {Object} pDataFields req Objekt von DBFelder
* @param {Object} pDataTypes req Objekt von DBTypes
* @param {Object} pDataTables req Array von Tabellen
* @param {Object} pFieldDef req Zuordnung der Importfelder
* @param {Object} pFieldValues req ImportWerte
* @param {String} pImportDefID req
* @param {Object} pAttrObject req
* @param {Object} pDubParams req Parameter für den Dublettencheck
*
* @return {void}
*/
function ImportData ( pDataFields, pDataTypes, pDataTables, pFieldDef, pFieldValues, pImportDefID, pAttrObject, pDubParams )
{
    var LeadValues = SetValues( pDataFields["LEAD"], pFieldDef, pFieldValues )
    var orgid = ""; // ID der Organisation
    var persid = ""; // ID der Person
    var relid = ""; // ID der Relation
    var objID = "";  // objId für Hisorylink
    var org_dup = false;  // org Duplettre vorhanden
    var pers_dup = false; // pers Duplettre vorhanden
    var org_new = false;  // org angelegt
    var pers_new = false; // pers angelegt
    var funkt_new = false; //  funktion angelegt
    var historyid = "";
    var ret;	
    //  Org anlegen
    if  ( LeadValues[ "ORGNAME" ] != "" )
    {	
        orgid = CheckDup( LeadValues, "ORG", pDubParams );
        if ( orgid == -1)
        {	
            ret  = InsertOrg( pDataFields, pDataTypes,  pFieldDef, pFieldValues );
            orgid = ret[0];
            relid = ret[1];
            objID = "1";
            org_new = true;  // org angelegt
            InsertAttr( pDataFields, pDataTypes, pFieldDef, LeadValues, relid, objID );
            InsertComm( pDataFields, pDataTypes, LeadValues, relid, true );
        }
        else if ( orgid == "" ) 	org_dup = true;  //  OrgDublette vorhanden
    }
    //  Pers anlegen
    if  ( LeadValues[ "LASTNAME" ] != "" )
    {
        objID = "2";
        persid = CheckDup( LeadValues, "PERS", pDubParams );
        if ( persid == -1 )
        {
            ret = InsertPers( pDataFields, pDataTypes,  pFieldDef, pFieldValues, orgid == "" );
            persid = ret[0];		
            relid = ret[1];
            pers_new = true;
            InsertAttr( pDataFields, pDataTypes, pFieldDef, LeadValues, relid, objID );
            InsertComm( pDataFields, pDataTypes, LeadValues, relid, false );
        }
        else if ( persid == "" ) pers_dup = true;    //  PersDublette vorhanden
    }
    //  Funktion anlegen
    if  ( orgid != "" && persid != "" )
    {
        objID = "3";
        relid = a.sql("select RELATIONID from RELATION where ORG_ID = '" + orgid + "' and PERS_ID = '" + persid + "'");

        if ( relid == "")
        {
            relid = InsertRel( pDataFields, pDataTypes,  pFieldDef, pFieldValues, orgid, persid );
            funkt_new = true;
            InsertAttr( pDataFields, pDataTypes, pFieldDef, LeadValues, relid, objID );
            InsertComm( pDataFields, pDataTypes, LeadValues, relid, false );
        }
    }
    var status = GetLeadStatus( org_dup, pers_dup, org_new, pers_new, funkt_new );
    if ( 	relid != "" )
    { 
        var info = GetLeadStatusText( status, ( org_dup || pers_dup ) ? 1 : 0 );
        //  History für die Relation anlegen
        historyid = newHistory(a.valueof("$global.user_relationid"), "9", "o", a.translate("Leadimport"),
            info, new Array(new Array(relid, objID)), LeadValues["DATE_NEW"], "IMP-" + a.valueof("$sys.user"));
    }
    LeadValues["IMPORTDEV_ID"] = pImportDefID;
    LeadValues["ORG_ID"] = orgid;
    LeadValues["PERS_ID"] = persid;		
    LeadValues[ "STATUS" ] = status;
    LeadValues["DUPLICAT"] = ( ( org_dup || pers_dup ) ? "1" : "0" );

    InsertTable( pDataFields, pDataTypes ,LeadValues, "LEAD" );
    InsertLeadAttr( pAttrObject, orgid, persid, historyid, LeadValues["DATE_NEW"] );
}

/*
* Verarbeitet die Dubletten.
*
* @param {Object} pDataFields req Object von DBFelder
* @param {Object} pDataTypes req Object von DBTypes
* @param {Object} pDataTables req Array von Tabellen
* @param {Object} pFieldDef req Zuordnung der Importfelder
* @param {String} pLeadID req
* @param {String} orgid req
* @param {Boolean} org_new req
* @param {String} persid req
* @param {Boolean} pers_new req
* @param {String} pImportDefID req
* @param {Object} pDubParams req Parameter für den Dublettencheck
*
* @return {Object} { Org: , Pers: }
*/
function ImportDuplicate ( pDataFields, pDataTypes, pDataTables, pFieldDef, pLeadID, orgid, org_new, persid, pers_new, pImportDefID, pDubParams )
{   
    var ret;
    var pFieldValues = a.sql("select " + pDataFields["LEAD"].join(", ") + " from LEAD where LEADID = '" +  pLeadID + "'", a.SQL_ROW );
    var LeadValues = SetValues( pDataFields["LEAD"], pFieldDef, pFieldValues )
    var relid = ""; // ID der Relation
    var objID = "";  // objId für Hisorylink
    var funkt_new = false; //  funktion angelegt
    var historyid = ""
    var pAttrObject = getLeadAttr( pImportDefID )
    //  Org anlegen
    if  ( org_new )
    {	
        ret  = InsertOrg( pDataFields, pDataTypes,  pFieldDef, pFieldValues );
        orgid = ret[0];
        relid = ret[1];
        objID = "1";
        InsertAttr( pDataFields, pDataTypes, pFieldDef, LeadValues, relid, objID );
        InsertComm( pDataFields, pDataTypes, LeadValues, relid, true );
    }
    //  Pers anlegen
    if  ( pers_new )
    {
        ret = InsertPers( pDataFields, pDataTypes,  pFieldDef, pFieldValues, orgid == "" );
        persid = ret[0];		
        relid = ret[1];
        objID = "2";
        InsertAttr( pDataFields, pDataTypes, pFieldDef, LeadValues, relid, objID );
        InsertComm( pDataFields, pDataTypes, LeadValues, relid, false );
    }
    //  Funktion anlegen
    if  ( orgid != "" && persid != "" )
    {
        objID = "3";
        // Neue Relations-ID, die bei Zuordnung einer bestehenden Person zu einer Organisation generiert wird
        relid = a.sql("select RELATIONID from RELATION where ORG_ID = '" + orgid + "' and PERS_ID = '" + persid + "'");
        // Benötigt für transferComm: ID der bestehenden, bereits importierten Privatrelation der übernommenen Person
        relid_old = a.sql("select RELATIONID from RELATION where " + trim("RELATION.ORG_ID") + " = '0' and PERS_ID = '" + persid + "'");
				
        if ( relid == "")
        {
            relid = InsertRel( pDataFields, pDataTypes,  pFieldDef, pFieldValues, orgid, persid );
            // Überträgt die Kommunikationsdaten der Privatrelation aus relid_old in die Relation bei relid_new
            transferComm(relid_old, relid);
            funkt_new = true;
        }
        InsertAttr( pDataFields, pDataTypes, pFieldDef, LeadValues, relid, objID );
        InsertComm( pDataFields, pDataTypes, LeadValues, relid, false );
    }
    var status = GetLeadStatus( false, false, org_new, pers_new, funkt_new );
    if ( 	relid != "" )
    { 
        var info = GetLeadStatusText( status, 0 )
        //  History für die Relation anlegen
        historyid = newHistory(a.valueof("$global.user_relationid"), "9", "o", a.translate("Leadimport"), 
            info, new Array(new Array(relid, objID)),  LeadValues["DATE_NEW"], "IMP-" + a.valueof("$sys.user"));
    }
    LeadValues["STATUS"] = status;		
    LeadValues["DUPLICAT"] = 0;
    var fields = new Array( "DUPLICAT","STATUS","ORG_ID", "PERS_ID", "USER_EDIT", "DATE_EDIT" );
    InsertLeadAttr( pAttrObject, orgid, persid, historyid, LeadValues["DATE_NEW"] );
    a.sqlUpdate("LEAD", fields, a.getColumnTypes( "LEAD", fields ), new Array("0", status, orgid, persid, a.valueof("$sys.user"), a.valueof("$sys.date")), "LEADID = '" + pLeadID + "'");
    return { Org: orgid, Pers: persid };
}

/*
* Lagert Kommunikationsdaten von einer Relations-ID auf eine andere um.
*
* @param {String} pRelOld req die alte Relations-ID
* @param {String} pRelNew req die neue Relations-ID
*  
* @return {Object} für die Attribute
*/
function transferComm(pRelOld, pRelNew)
{
    if(pRelOld != "" && pRelNew != "")
    {
        // Speichere Kommunikationsdaten in neuer Relation mittels sqlUpdate:
        var spalten = ["RELATION_ID"];
        var typen = a.getColumnTypes(a.getCurrentAlias(), "COMM", spalten);
        var werte = [ pRelNew ] ;
        var erg = a.sqlUpdate("COMM", spalten, typen, werte, "COMM.RELATION_ID = '" + pRelOld + "'");
        log.log("Aktualisiert:"+erg+"\n\n");
    }
}

/*
* Legt die Attribute an.
*
* @param {Object} pAttrObject req das Objekt für die Attribute
* @param {String} orgid req die ORGID
* @param {String} persid req die PERSID
* @param {String} historyid req die HISTORYID
* @param {Datetime} datenew req aktuelles Datum
*
* @return {Object} für die Attribute
*/
function InsertLeadAttr ( pAttrObject, orgid, persid, historyid, datenew )
{
    for ( var i = 0; i < pAttrObject["Values"].length; i++ )
    {
        var AttrValues = pAttrObject["Values"][i];
        AttrValues[9] = datenew;
        AttrValues[10] = a.valueof("$sys.user");
        // Attribute für Org
        if ( orgid != "" && AttrValues[0] == "1" )
        {
            AttrValues[7] = a.sql("select RELATIONID from RELATION where PERS_ID is null and ORG_ID = '" + orgid + "'");
            sqlInsertAttr( pAttrObject, AttrValues );
        }
        // Attribute für Pers
        if ( persid != "" && AttrValues[0] == "2" )
        {
            if ( orgid == "" )	orgid = "0";  // Privat
            AttrValues[7] = a.sql("select RELATIONID from RELATION where " + trim("ORG_ID") + " = '" + orgid + "' and PERS_ID = '" + persid + "'");
            sqlInsertAttr( pAttrObject, AttrValues );								
        }
        // Attribute für History
        if ( historyid != "" && AttrValues[0] == "4" )
        {								
            AttrValues[7] = historyid;
            sqlInsertAttr( pAttrObject, AttrValues );								
        }
    }
}

/*
* Fügt ein Attribut in der Datenbank hinzu
*
* @param {Object} pAttrObject req das Objekt für die Attribute
* @param {[]} pAttrValues req Werte des Attributes
*
* @return {void}
*/
function sqlInsertAttr( pAttrObject, pAttrValues )
{
    if ( isDuplicat( "ATTRLINK", pAttrObject["Fields"] , pAttrObject["Types"], pAttrValues  ) == "0" )
    {		
        pAttrValues[8] = a.getNewUUID();
        a.sqlInsert("ATTRLINK", pAttrObject["Fields"] , pAttrObject["Types"], pAttrValues );
    }
}

/*
* Gibt Objekt für die Attributanlage zurück.
*
* @param {String} pImportDefID req Id des verknüpften Datensatzes
*
* @return {Object} für die Attribute
*/
function getLeadAttr( pImportDefID )
{
    var ret = new Object();
    ret["Fields"]  = new Array( "OBJECT_ID", "ATTR_ID", "VALUE_CHAR","VALUE_DATE","VALUE_DOUBLE","VALUE_INT", "VALUE_ID", "ROW_ID","ATTRLINKID", "DATE_NEW", "USER_NEW" );
    ret["Types"] = a.getColumnTypes( "ATTRLINK", ret["Fields"]  );
    ret["Values"] = a.sql("select ATTROBJECT, ATTRLINK.ATTR_ID, VALUE_CHAR, VALUE_DATE, VALUE_DOUBLE, VALUE_INT, VALUE_ID, -1, -1, '', ''  from ATTRLINK  join ATTROBJECT  "
        + " on ( ATTROBJECT.ATTR_ID = ATTRLINK.ATTR_ID ) where OBJECT_ID = 17  and ATTROBJECT in (1,2,3,4) and ROW_ID = '" + pImportDefID + "'", a.SQL_COMPLETE);
    return ret;
}
/*
* Gibt den LeadStatus zurück.
*
* @param {Boolean} org_dup req true oder false
* @param {Boolean} pers_dup req true oder false
* @param {Boolean} org_new req true oder false
* @param {Boolean} pers_new req true oder false
* @param {Boolean} funkt_new req true oder false
 *
+ @return {Integer} LeadStatus
*/
function GetLeadStatus( org_dup, pers_dup, org_new, pers_new, funkt_new )
{
    var status = 0;
    //  Keine mögliche Dubletten 
    if ( !org_dup &&  !pers_dup )
    {
        //  1. Org, Pers und Rel eingefügt 
        if ( org_new && pers_new && funkt_new ) 	status = 1;
        //  2. Org eind.vorhanden, Pers und Rel eingefügt
        else if ( !org_new && pers_new && funkt_new ) status = 2;
        //  3. Org, Pers eind.vorhanden, Rel eingefügt
        else if ( !org_new && !pers_new && funkt_new ) status = 3;
        //  4. Pers eind.vorhanden,Org und Rel eingefügt
        else if ( org_new && !pers_new && funkt_new ) status = 4;
        //  5. Org, Pers, Rel eind.vorhanden
        else if ( !org_new && !pers_new && !funkt_new ) status = 5;		
    }
    //	mögliche Dubletten vorhanden
    else
    {
        //  1. Pers und Org mögliche Dublette vorhanden
        if ( org_dup && pers_dup ) 	status = 1;
        //  2. Pers mögliche Dublette vorhanden, Org eind.vorhanden
        else if ( pers_dup && !org_dup && !org_new ) status = 2;
        //  3. Pers mögliche Dublette vorhanden, Org eingefügt, 
        else if ( pers_dup && !org_dup && org_new ) status = 3;
        //  4. Org mögliche Dublette vorhanden, Pers eind.vorhanden, 
        else if ( org_dup && !pers_dup && !pers_new ) status = 4;
        //  5. Org mögliche Dublette vorhanden, Pers eingefügt, 
        else if ( org_dup && !pers_dup && pers_new )  status = 5;		
    }
    return status;
}
/*
* Gibt den Statustext zurück.
*
* @param {Integer} status req Status des Leads
* @param {Integer} duptype req Dublettentyp
*
* @return {String} LeadStatusText
*/
function GetLeadStatusText( status, duptype )
{
    var statustext = "";
    //  Keine mögliche Dubletten 
    if ( duptype == 0 )
    {
        switch(status)
        {
            case 0:
                statustext = a.translate("Organisation oder Person neu angelegt");
                break;
            case 1:
                statustext = a.translate("Organisation, Person und Funktion neu angelegt");
                break;
            case 2:
                statustext = a.translate("Organisation schon vorhanden\nPerson und Funktion neu angelegt");
                break;
            case 3:
                statustext = a.translate("Organisation und Person schon vorhanden\nFunktion neu angelegt");
                break;
            case 4:
                statustext = a.translate("Person schon vorhanden\nFunktion und Organisation neu angelegt");
                break;
            case 5:
                statustext = a.translate("Organisation, Person und Funktion schon vorhanden");
                break;
        }
    }
    else
    {
        switch(status)
        {
            case 1:
                statustext = a.translate("Organisation und Person mögliche Dublette");
                break;
            case 2:
                statustext = a.translate("Organisation schon vorhanden\nPerson mögliche Dublette");
                break;
            case 3:
                statustext = a.translate("Organisation neu angelegt\nPerson mögliche Dublette");
                break;
            case 4:
                statustext = a.translate("Person schon vorhanden\nOrganisation mögliche Dublette");
                break;
            case 5:
                statustext = a.translate("Person neu angelegt\nOrganisation mögliche Dublette");
                break;
        }
    }
    return statustext;
}	
	
/*
* Gibt Objekt mit Spalten der angegebenen Tabellen zurück.
*
* @param {[]} pDataTables req Array von Tabellennamen
*  
* @return {Object} mit Spalten
*/
function GetDataFields( pDataTables )
{
    var DataFields = new Object();
    for (var i = 0; i < pDataTables.length; i++ )
    {
        var FieldNames = a.getColumns(a.valueof("$sys.dbalias"), pDataTables[ i ] );
        //Spaltennamen alle groß schreiben
        for(var f = 0; f < FieldNames.length; f++)
        {
            FieldNames[f] = FieldNames[f].toUpperCase();
        }
        DataFields[ pDataTables[ i ] ] = FieldNames;
    }
    return DataFields;		
}
/*
* Gibt Objekt mit ColumnTypes der angegebenen Tabellen zurück.
* 
* @param {[]} pDataTables req Array von Tabellennamen
* @param {[]} pDataFields req Array von Tabellenfeldern
* 
* @return {Object} der ColumnTypes
*/
function GetDataTypes( pDataFields, pDataTables )
{
    var DataTypes = new Object();
    for (var i = 0; i < pDataTables.length; i++ )
    {
        DataTypes[ pDataTables[ i ] ] = a.getColumnTypes( pDataTables[ i ] , pDataFields[ pDataTables[ i ] ] );
    }
    return DataTypes;		
}

/*
* Überprüft und bereinigt das Land mit Hilfe der Tabelle COUNTRYINFO
*
* @param {String} pValue req das Land
* 
* @return {String} Value
*/
function checkCountry( pValue )
{
    var ret = pValue;
    if ( ret.length == 3 ) ret = a.sql("select ISO2 from COUNTRYINFO where ISO3 = '" + pValue + "'" );
    if ( ret.length > 3 ) 
        ret = a.sql("select ISO2 from COUNTRYINFO where NAME_DE = '" + pValue + "'" );
	
    if ( ret == "") ret = "DE";
    return ret;
}

/*
* Legt einen Datensatz an.
* 
* @param {[]} pDataFields req Object von Columns
* @param {[]} pDataTypes req Object von Typen
* @param {[]} pValues req Object von Werte
* @param {[]} pTable req Tabelle 
*
* @return {Integer} Tableid
*/
function InsertTable( pDataFields, pDataTypes, pValues, pTable )
{
    var Fields = pDataFields[ pTable ];
    var Types = pDataTypes[ pTable ];
		
    var TableValues = new Array();
    var TableID = pTable + "ID";
		
    if ( pValues[ TableID ] == undefined || pValues[ TableID ] == "" ) 	pValues[ TableID ] = a.getNewUUID();
    pValues[ "USER_NEW" ] = "IMP-" + a.valueof("$sys.user");
    for (var i = 0; i < Fields.length; i++)
    {
        if ( Fields[ i ] == "COUNTRY")	pValues[ Fields[ i ] ] =  checkCountry(pValues[ Fields[ i ] ]);
        if ( pValues[ Fields[ i ] ] != "" && Fields[ i ] != "DATE_NEW" ) 
        {
            try
            {
                switch( String( Types[i] ) )
                {
                    // Formatierung von bestimmten Datentypen z.B.: Datum
                    case String(SQLTYPES.DATE):
                    case String(SQLTYPES.TIMESTAMP):
                        pValues[ Fields[ i ] ] = date.dateToLong( pValues[ Fields[ i ] ], "dd.MM.yyyy" );
                        break;
                    case String(SQLTYPES.DECIMAL):
                    case String(SQLTYPES.DOUBLE):
                    case String(SQLTYPES.FLOAT):
                        pValues[ Fields[ i ] ] = a.parseDouble( pValues[ Fields[ i ] ], "#.#" );
                        break;
                }
            }catch(err)
            {
                log.log(err, log.WARNING);
            }			
        }
        TableValues[ i ] = pValues[ Fields[ i ] ];
    }
    if (a.valueof("$image.abbruchImport") == "false" && a.valueof("$image.impError") == "false")
    {
        try
        {
            a.sqlInsert( pTable, Fields, Types, TableValues );
        }
        catch (e)
        {
            var str = pValues["ORGNAME"] + ", " + pValues["ZIP"] + " " + pValues["CITY"] + ", " + pValues["SALUTATION"] + " " + pValues["LASTNAME"];
            var msg = a.translate("Ein Fehler ist aufgetreten beim Import dieses Datensatzes:\n")
            + str + "\n"
            + a.translate("Möglicherweise ist ein Import-Feld zu groß für das Zielfeld.") + "\n"
            + a.translate("Möchten Sie den Import abbrechen?");
																
            var antwort = a.askQuestion(msg, a.QUESTION_YESNO, "");
            log.show(e);
				
            a.imagevar("$image.impError", "true");
				
            if (antwort == "true")
            {
                a.imagevar("$image.abbruchImport", "true");
            }
        }
    }
    return pValues[ TableID ];
}

/*
* Setzt Werte einer Tabelle.
*
* @param {String []} pFields req Felder
* @param {String []} pFieldDef req Zuordnung der Importfelder
* @param {String []} pFieldValues req ImportWerte
* 
* @return {Object} mit den zugewiesenen Werten
*/
function SetValues ( pFields, pFieldDef, pFieldValues )
{
    var DataValues = new Object();
    var i;
    //  Datenwerte vorbelegen
    for (i = 0; i <  pFields.length; i++)
    {
        DataValues[ pFields[ i ] ] = ""; 
    }
    // Datenwerte setzen
    for (i = 0; i < pFieldDef.length; i++)
    {
        try
        {
            if (  pFieldValues[ pFieldDef[ i ][ 0 ] ] != undefined )
                DataValues[ pFieldDef[ i ][ 1 ] ] = pFieldValues[ pFieldDef[ i ][ 0 ] ];
        }
        catch(ex)
        {
            log.log(ex, log.WARNING);
        }
    }
    return DataValues;
}

/*
* Org anlegen.
* 
* @param {[]} pDataFields req Object von DBFelder
* @param {[]} pDataTypes req Object von DBTypes
* @param {[]} pFieldDef req Zuordnung der Importfelder
* @param {[]} pFieldValues req ImportWerte
*
* @return {String []} ( orgid, relid )
*/
function InsertOrg( pDataFields, pDataTypes,  pFieldDef, pFieldValues )
{
    var OrgValues = SetValues( pDataFields["ORG"], pFieldDef, pFieldValues );
    var RelValues = SetValues( pDataFields["RELATION"], pFieldDef, pFieldValues );
    var AddrValues = SetValues( pDataFields["ADDRESS"], pFieldDef, pFieldValues );
    var orgid = InsertTable( pDataFields, pDataTypes, OrgValues, "ORG" );
    //  Relation für Org anlegen
    RelValues["STATUS"] = "1";
    RelValues["ORG_ID"] = orgid;
    RelValues["ADDR_TYPE"] = "1";
    RelValues["RELPOSITION"] = "";
    RelValues["RELTITLE"] = "";
    RelValues["PERS_ID"] = "";
    RelValues["ADDRESS_ID"] = a.getNewUUID();
    var relid =  InsertTable( pDataFields, pDataTypes, RelValues, "RELATION" );
    AddrValues["ADDRESSID"] = RelValues["ADDRESS_ID"];
    AddrValues["ADDR_TYPE"] = "1";
    AddrValues["RELATION_ID"] = relid;			  
    var addrid = InsertTable( pDataFields, pDataTypes, AddrValues, "ADDRESS" );
    return new Array( orgid, relid );
}

/*
* Person anlegen.
* 
* @param {[]} pDataFields req Object von DBFelder
* @param {[]} pDataTypes req Object von DBTypes
* @param {[]} pFieldDef req Zuordnung der Importfelder
* @param {[]} pFieldValues req ImportWerte
* @param {Boolean} isprivat Gibt an, ob es sich um eine Privatperson handelt
*
*
* @return {String []} ( persid, relid )
*/
function InsertPers( pDataFields, pDataTypes,  pFieldDef, pFieldValues, isprivat )
{
    var PersValue = SetValues( pDataFields["PERS"], pFieldDef, pFieldValues );
    var persid = InsertTable( pDataFields, pDataTypes, PersValue, "PERS" );
    //  Relation für Privat-Person anlegen
    if ( isprivat )
    {
        var RelValues = SetValues( pDataFields["RELATION"], pFieldDef, pFieldValues );
        RelValues["STATUS"] = "1";
        RelValues["PERS_ID"] = persid;
        RelValues["ORG_ID"] = 0;			  
        RelValues["ADDRESS_ID"] = a.getNewUUID();
        RelValues["RELPOSITION"] = "";
        RelValues["RELTITLE"] = "";
        var relid =  InsertTable( pDataFields, pDataTypes, RelValues, "RELATION" );
        var AddrValues = SetValues( pDataFields["ADDRESS"], pFieldDef, pFieldValues );
        AddrValues["ADDRESSID"] = RelValues["ADDRESS_ID"];
        AddrValues["ADDR_TYPE"] = "2";
        AddrValues["RELATION_ID"] = relid;			  
        var addrid = InsertTable( pDataFields, pDataTypes, AddrValues, "ADDRESS" );
    }
    return new Array( persid, relid );
}

/*

* Funktion anlegen.
*
* @param {[]} pDataFields req Object von DBFelder
* @param {[]} pDataTypes req Object von DBTypes
* @param {[]} pFieldDef req Zuordnung der Importfelder
* @param {[]} pFieldValues req ImportWerte
* @param {String} orgid req ID der ORG
* @param {String} persid req ID der Pers
* 
* @return {void}
*/
function InsertRel( pDataFields, pDataTypes,  pFieldDef, pFieldValues, orgid, persid )
{
    var RelValues = SetValues( pDataFields["RELATION"], pFieldDef, pFieldValues );
    var addrid = a.sql("select ADDRESS_ID from RELATION where PERS_ID is null and ORG_ID = '" + orgid + "'");
    //  Relation für Funktion anlegen
    RelValues["STATUS"] = "1";
    RelValues["ORG_ID"] = orgid;
    RelValues["PERS_ID"] = persid;
    RelValues["ADDRESS_ID"] = addrid;
    RelValues["DEPARTMENT"] = "";
    return  InsertTable( pDataFields, pDataTypes, RelValues, "RELATION" );
}

/*
* Kommunikation anlegen.
*
* @param {[]} pDataFields req Objekt von DBFelder
* @param {[]} pDataTypes req Objekt von DBTypes
* @param {[]} pLeadValues req Werte des Leads
* @param {String} relid req RELATIONID
* @param {Integer} isorg req
* 
* @return {void}
*/
function InsertComm( pDataFields, pDataTypes, pLeadValues, relid, isorg )
{
    var Fields = pDataFields[ "COMM" ];
    var i;

    // Org- und Pers-Commdaten getrennt angeben
    var fieldname = isorg ? "ORGCOMM" : "PERSCOMM";

    var DataValues = new Object();
    //  Datenwerte vorbelegen
    for (i = 0; i <  Fields.length; i++)			DataValues[ Fields[ i ] ] = ""; 
    DataValues["RELATION_ID"] = relid;
    DataValues["DATE_NEW"] = pLeadValues["DATE_NEW"];

    for (i = 1; i <  20; i++)
    {
        var medium = fieldname + i;
        if ( pLeadValues[ medium ] != undefined && pLeadValues[ medium ] != "" )
        {
            DataValues[ "COMMID" ] = "";
            DataValues[ "MEDIUM_ID" ] = i;
            DataValues[ "ADDR" ] = pLeadValues[ medium ];
            DataValues[ "SEARCHADDR" ] = getSearchAddr(i, pLeadValues[ medium ]);
    
            InsertTable( pDataFields, pDataTypes, DataValues, "COMM" );
        }
    }
}

/*
* Attribute anlegen.
*
* @param {[]} pDataFields req Objekt von DBFelder
* @param {[]} pDataTypes req Objekt von DBTypes
* @param {[]} pFieldDef req Zuordnung der Importfelder
* @param {[]} pLeadValues req Werte des Leads
* @param {String} pRelid req RELATIONID
* @param {String} pObjectID req ID des Objects
* 
* @return {void}
*/
function InsertAttr( pDataFields, pDataTypes, pFieldDef, pLeadValues, pRelid, pObjectID  )
{
    var Fields = pDataFields[ "ATTRLINK" ];
    if ( pObjectID == 3 )  pObjectID = 2;
    // Datenwerte setzen
    for (var i = 0; i < pFieldDef.length; i++)
    {
        if( pFieldDef[i][1].substr(0, 9) == "ATTRIBUTE" && pFieldDef[i][2] != undefined )
        {
            var attrdata = pFieldDef[i][2];
            //  
            if (  attrdata[4][ pObjectID ] != undefined )
            { 			
                var DataValues = new Object();
                var value = pLeadValues[pFieldDef[i][1]];
                //  Datenwerte vorbelegen
                for (var z = 0; z <  Fields.length; z++)	DataValues[ Fields[ z ] ] = ""; 
                DataValues["DATE_NEW"] = pLeadValues["DATE_NEW"];
                DataValues["OBJECT_ID"] = pObjectID;
                DataValues["ATTR_ID"] = attrdata[1];
                DataValues["ROW_ID"] = pRelid;
                switch(  parseInt(attrdata[2])  )
                {
                    case 1: //Combo		
                        value = a.sql("select attrid from attr where attr_id = '" + 
                            DataValues["ATTR_ID"] + "' and attrname = '" + value + "'");
                        break;
                    case 7: //SelectCombo
                        value = "";
                        break;
                }
                DataValues[ attrdata[3] ] =  value;
                InsertTable( pDataFields, pDataTypes, DataValues, "ATTRLINK" );
            }
        }
    }
}

/*
* Dublette checken.
*
* @param {[]} pLeadValues req Werte des Leads
* @param {String} Frame req ORG oder PERS
* @param {Object} pDubParams req Parameter für den Dublettencheck
*
* @return {Integer} -1 kann angeegt werden,  "" kann eine Dublette sein ,  > 0 id eindeutig vorhanden 
*/
function CheckDup( pLeadValues, Frame, pDubParams )
{
    var condition =  " where ";
    var fields;
    if (Frame == "ORG")     
    {    
        fields = ["ORGNAME", "COUNTRY", "ADDRESS", "CITY", "ZIP", "COUNTRY" ];
        condition += " PERS_ID is null";
    }
    else
    {    
        fields = ["SALUTATION", "LASTNAME", "FIRSTNAME", "COUNTRY", "ADDRESS", "CITY", "ZIP", "COUNTRY" ];
        condition += " PERS_ID is not null";
    }
    for ( var i = 0; i < fields.length; i++ )  
        condition += " and " + fields[i] + " = '" +  pLeadValues[ fields[i] ].replace(new RegExp("'", "g"),"''") + "' and "  + fields[i] + " is not null";		
                
    //  Suchen ob Object schon vorhanden			
    id = a.sql("select " + Frame + "ID from " + Frame + " join RELATION on (" + Frame + "ID = RELATION." + Frame + "_ID) join ADDRESS on ADDRESSID = ADDRESS_ID " + condition );
    // wenn nicht vorhanden mögliche Dublette suchen
    if ( id == "")
    {	
        if (Frame == "ORG")     id = hasOrgDuplicates( "", getOrgLeadPattern( pLeadValues, pDubParams ) );
        else id = hasPersDuplicates( "", "", getPersLeadPattern( pLeadValues, pDubParams ) );
        if ( id.length == 0 )   id = '-1';//  Kann neu angelegt werden !
        else id = "";
    }
    return id;
}

/*
* Ermittelt das Dublettenkriterium für ORG
* 
* @param {[]} pLeadValues req Werte des Leads
* @param {Object} pDubParams req Parameter für den Dublettencheck
*
* @return {String} das Dublettenkriterium
*/
function getOrgLeadPattern( pLeadValues, pDubParams )
{
    var ddata = [];
    var commdata = [];
    // Felder
    ddata.push(["orgname", pLeadValues[ "ORGNAME" ]]);
    // Adressen
    ddata.push(["address", [ [ "city", pLeadValues[ "CITY" ]], ["address", pLeadValues[ "ADDRESS" ]], ["zip", pLeadValues[ "ZIP" ]], ["country", pLeadValues[ "COUNTRY" ]] ] ]);
    // Kommunkationsdaten
    for (i = 1; i <  5; i++)
    {
        var medium = "ORGCOMM" + i;
        if ( pLeadValues[ medium ] != undefined && pLeadValues[ medium ] != "" )
        {
            commdata.push([ pDubParams.OrgComm[i], pLeadValues[medium] ] );
        }
    }
    if ( commdata.length > 0 )  ddata.push(["comm", commdata ] );
    return getPattern( ddata, pDubParams.Org );
}

/*
* Ermittelt das Dublettenkriterium für PERS
*
* @param {[]} pLeadValues req Werte des Leads
* @param {Object} pDubParams req Parameter für den Dublettencheck
*
* @return {String} das Dublettenkriterium
*/
function getPersLeadPattern( pLeadValues, pDubParams )
{
    var ddata = [];
    var commdata = [];
    // Felder
    ddata.push(["salutation", pLeadValues[ "SALUTATION" ]]);
    ddata.push(["lastname", pLeadValues[ "LASTNAME" ]]);
    ddata.push(["firstname", pLeadValues[ "FIRSTNAME" ]]);
    // Adressen
    ddata.push(["address", [ [ "city", pLeadValues[ "CITY" ]], ["address", pLeadValues[ "ADDRESS" ]], ["zip", pLeadValues[ "ZIP" ]], ["country", pLeadValues[ "COUNTRY" ]] ] ]);
    // Kommunkationsdaten
    for (i = 1; i <  11; i++)
    {
        var medium = "PERSCOMM" + i;
        if ( pLeadValues[ medium ] != undefined && pLeadValues[ medium ] != "" )
        {
            commdata.push([ pDubParams.PersComm[i], pLeadValues[medium] ] );
        }
    }
    if ( commdata.length > 0 )  ddata.push(["comm", commdata ] );
    return getPattern( ddata, pDubParams.Pers );
}

/*
* Fügt Arrays zusammen.
* 
* @param {[]} pArray req
* @param {[]} pAddArray req 
* 
* @return {[]} neues Array
*/
function AddArray( pArray, pAddArray )
{
    var NewArray = new Array()
    for(var i = 0; i < pArray.length; i++)
        NewArray.push( pArray[i] );
    NewArray.push( pAddArray );
    return NewArray;	
}

/*
* Laden der Daten.
*
* @param {String} pFile req Pfad der Importdatei
* 
* @return {void}
*/
function LoadImportFile(pFile)
{
    var rowanz = 0;
    if (pFile != "")
    {
        var FieldSep = a.valueof("$comp.FIELDSEPERATOR") 		 			// Feldtrenner
        var FieldLimit = a.valueof("$comp.FIELDLIMIT").charAt(0); 			// Feldbegrenzer
        var RecordSep = a.valueof("$comp.RECORDSEPERATOR")	// Zeilentrenner
        if (RecordSep == "CRLF") RecordSep = '\r\n';
        if ( FieldSep == "tab" ) FieldSep = '\t';
        else FieldSep = FieldSep.charAt(0);
        try
        {
            var daten = a.doClientIntermediate(a.CLIENTCMD_GETDATA, new Array(pFile, a.DATA_TEXT));
            var tabelle = a.parseCSV( daten.replace(/(^\s+)|(\s+$)/g,""), RecordSep, FieldSep, FieldLimit );
            if (tabelle.length > 0)		rowanz = tabelle[0].length;
            a.showMessage(tabelle.length +" "+a.translate("Zeilen eingelesen"));
            a.imagevar("$image.ImportValues", tabelle);
            a.refresh("$comp.tbl_import");
        }
        catch(ex)
        {
            log.log(ex, a.translate("Datei kann nicht geladen werden !"), true, true);       
        }
    }
    return rowanz;
}
/*
* Das nächste Lead selektieren.
* 
* @return  {void}
*/
function nextLead()
{
    if (a.valueof("$sys.datarowcount") < 2)
    { 
        a.showMessage(a.translate("keine Dubletten mehr vorhanden!"));
        a.closeCurrentTopImage();
    }
    else
    {			 
        a.doAction(ACTION.FRAME_NEWSELECTION);
        a.doAction(ACTION.FRAME_RUNSELECTION);
    }
}

/*
* Gibt Importfelder zurück.
*
* @param {String} pID req ImportID
* 
* @return {[]}  new Array ImportFieldDef
*/
function getImportFieldDef( pID )
{
    var attrfields = new Array("VALUE_ID","VALUE_CHAR","VALUE_CHAR","VALUE_DATE","VALUE_INT","VALUE_FLOAT","VALUE_ID");
    var ImportFieldDef = a.sql("select distinct FIELDNUMBER, KEYNAME1, KEYDETAIL from IMPORTFIELDDEV join KEYWORD on (KEYNAME2 = FIELDNAME) "
        + " where IMPORTDEV_ID = '" + pID + "' order by FIELDNUMBER", a.SQL_COMPLETE);
    var FieldDef = new Array();
    for ( i=0; i < ImportFieldDef.length; i++ )
    {
        FieldDef[i] = new Array ( ImportFieldDef[i][0], ImportFieldDef[i][1] )
        if( ImportFieldDef[i][1].substr(0, 9) == "ATTRIBUTE" )
        {
            var attr = ImportFieldDef[i][2].split(".");
            var attrdata = a.sql("select ATTRID, ATTRCOMPONENT from ATTR where ATTRNAME = '" + attr[attr.length-1] + "'", a.SQL_ROW);
            var attrobj = a.sql("select ATTROBJECT, MAXCOUNT from ATTROBJECT where ATTR_ID = '" + attrdata[0] + "'", a.SQL_COMPLETE);
            var attrobject = new Object();
            for ( var z = 0; z < attrobj.length; z++ )	attrobject[ attrobj[z][0] ] = attrobj[z][1]; 
            FieldDef[i][2] = new Array( attr[0], attrdata[0], attrdata[1], attrfields[attrdata[1]-1] , attrobject );
        }
    }
    return FieldDef;
}