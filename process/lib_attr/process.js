import("lib_grant");
import("lib_sql");
import("lib_util");

/*
* Gibt den Wert eines Attributes zurück.
*
* @param {String} pAttrName req wenn leer dann alle Attribute
* @param {String} pObjectID req ID des verknüpften Frames
* @param {String} pRowID req ID des verknüpften Datensatzes
* @param {Boolean} pwithName req wenn true dann mit Bezeichnung
* @param {String} pUser opt User
*
@return {[]} werte in Array 
*/
function GetAttribute( pAttrName, pObjectID, pRowID, pwithName, pUser )
{
    var rettab = new Array();
    var tab = GetAttrArray( pObjectID, pRowID, pAttrName, undefined, pUser );
    for ( var i = 0; i < tab.length; i++ )
    {
        var zeile = ""
        // AttrNamen werden mitgegeben
        if ( pwithName )
        {
            zeile = tab[i][3];
            if ( tab[i][4] != "") zeile += ", " + tab[i][4];
            zeile += ": ";
        }
        zeile += tab[i][5];
        rettab[i] = zeile; 
    }
    return rettab;
}
/*
* Gibt den Schlüsselwert eines Attributes zurück.
*
* @param {String} pAttrName req wenn leer dann alle Attribute
* @param {String} pObjectID req ID des verknüpften Frames
* @param {String} pRowID req ID des verknüpften Datensatzes
* @param {String} pUser opt User
*
* @return {[]} werte in Array 
*/
function GetAttributeKey( pAttrName, pObjectID, pRowID, pUser )
{
    var rettab = new Array();
    var tab = GetAttrArray( pObjectID, [pRowID], pAttrName, "getkey", pUser );
    for ( var i = 0; i < tab.length; i++ )	rettab[i] = tab[i][5]; 
    return rettab;
}

/*
* Liefert einen SQL zurück, der das Attribute auflöst.
*
* @param {String} pAttrName req Attributname
* @param {String} pValueFieldName Fieldname für ROW_ID in ATTRLink 
* @param {Boolean} pOrginal opt true, falls Orginalwerte 
*
* @return  {String} SQLString der Attribute auflöst
*/
function getAttrSQL( pAttrName, pValueFieldName, pOrginal )
{
    if ( pOrginal == undefined ) 	pOrginal = false;
    var attr = pAttrName.split(".");
    if ( attr.length > 1)
        attr = a.sql("select A2.ATTRID, A2.ATTRCOMPONENT, A2.SQLIDCOLUMN, A2.SQLSHOWCOLUMN, A2.SQLFROMDEF, A2.SQLWHERE from ATTR A2 "
            + " join ATTR A1 on A1.ATTRID = A2.ATTR_ID where A1.ATTRNAME = '" + attr[0] + "' and A2.ATTRNAME = '" + attr[1] + "'", a.SQL_ROW);
    else
        attr = a.sql("select ATTRID, ATTRCOMPONENT, SQLIDCOLUMN, SQLSHOWCOLUMN, SQLFROMDEF, SQLWHERE from ATTR where ATTRNAME = '" + pAttrName + "'", a.SQL_ROW);
    var retsql = " ' Attribute <" + pAttrName + "> nicht vorhanden !' ";
    switch ( parseInt(attr[1]) )
    {
        case 1:  // Combobox
            if ( pOrginal )
                retsql = "( select max(VALUE_ID) from ATTRLINK where ATTR_ID = '" + attr[0] + "' and	ROW_ID = " + pValueFieldName + " )";
            else
                retsql = "( select max(ATTRNAME) from ATTR join ATTRLINK on VALUE_ID = ATTRID where ATTR.ATTR_ID = '" 
                + attr[0] + "' and	ROW_ID = " + pValueFieldName + " )";
            break;
        case 2: // Stringfeld
            retsql = "( select max(VALUE_CHAR) from ATTRLINK where ATTR_ID = '" + attr[0] + "' and ROW_ID = " + pValueFieldName + " )" ;
            break;
        case 3: // Checkbox
            retsql = "( select case when max(VALUE_CHAR) = 'Y' then " + a.translate("Ja") + " else '" + a.translate("Nein") 
            + "' end from ATTRLINK where ATTR_ID = '" + attr[0] + "' and ROW_ID = " + pValueFieldName + " )" ;
            break;
        case 4: // Datumsfeld
            retsql = "( select max(VALUE_DATE) from ATTRLINK where ATTR_ID = '" + attr[0] + "' and ROW_ID = " + pValueFieldName + " )" ;
            break;
        case 5: // Zahlenfeld
            retsql = "( select max(VALUE_INT) from ATTRLINK where ATTR_ID = '" + attr[0] + "' and ROW_ID = " + pValueFieldName + " )" ;
            break;
        case 6: // Kommafeld
            retsql = "( select max(VALUE_DOUBLE) from ATTRLINK where ATTR_ID = '" + attr[0] + "' and ROW_ID = " + pValueFieldName + " )" ;
            break;
        case 7:  // SelectCombobox
            if ( pOrginal )
                retsql = "( select max(VALUE_ID) from ATTRLINK where ATTR_ID = '" + attr[0] + "' and	ROW_ID = " + pValueFieldName + " )";
            else
            {
                retsql = "( select max(" + concat( attr[3].split(",")) + ") from " + attr[4] + " join ATTRLINK on VALUE_ID = " + attr[2] 
                + " where ATTRLINK.ATTR_ID = '" + attr[0] + "' and  ATTRLINK.ROW_ID = " + pValueFieldName;

                // if we have a SQLWEHERE definition in the attr declaration
                if(attr[5] != "")		retsql += " and " + attr[5];
                retsql += " )";
                retsql = resolveFunction( a.resolveVariables( retsql ) );		
            }
            break;
    }
    return retsql;
}

/*
* Gibt die ausgewählte Komponente zurück.
*
* @param {Integer} attribute1 req
* @param {Integer} attribute2 req
*
* @return {String} mit Komponente
*/
function GetComponent(attribute1, attribute2)
{
    var attribute = "";
    if ( attribute2 == null || attribute2 == "") attribute = attribute1;
    else attribute = attribute2;
    var component = "";
    if (attribute != "")
    {
        component = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + attribute + "'");
    }
    return component;
}

/*
* Gibt Tabelle der Attribute zurück.
*
* @param {String} objectid req ID des verknüpften Frames
* @param {String} pRowID req ID des verknüpften Frames
* @param {Boolean} pOriginal opt if true Orginalwerte 
*
* @return {[]} Tabelle mit den Attributen
*/
function AttributeTable(objectid, pRowID, pOriginal)
{
    var tab = "";
    if (pRowID != "")		tab = GetAttrArray(objectid, pRowID, "", pOriginal);
    if (tab.length == 0) tab = a.createEmptyTable(6);
    return tab;
}

/*
* Gibt Array von Attribute zurück.
*
* @param {String} pObjectid req ID des verknüpften Frames
* @param {String} pRowid req ID des verknüpften Datensatzes
* @param {String} pAttrName req wenn leer dann alle Attribute
* @param {Boolean} pOriginal opt if true Orginalwerte 
* @param {String} pUser opt User
*
* @return {[]} 
*/
function GetAttrArray( pObjectid, pRowid, pAttrName, pOriginal, pUser )
{
    var condition;
    var tab = new Array();
    if ( pOriginal == undefined )	pOriginal = false;
    if ( pOriginal == true )
    {
        condition = "ATTRLINKID in ('" + pRowid.join("','") + "')";	
    }
    else condition = getGrantCondition("ATTRIBUTES", "OBJECT_ID = " + pObjectid + " AND ROW_ID = '" + pRowid + "'", "A.ATTRID", undefined , pUser );
    if ( pOriginal == "getkey") 	pOriginal = true;
    if ( pAttrName != "" ) 
    {
        var attr = pAttrName.split(".");
        if ( attr[1] != undefined)
        {
            condition += " AND B.ATTRNAME = '" +  attr[0] + "'";
            if ( attr[1] != "" )	condition +=  " AND A.ATTRNAME = '" + attr[1] + "'";
        }
        else condition +=  " AND A.ATTRNAME = '" + pAttrName + "'";
    }
    var attr_value = a.sql("SELECT ATTRLINKID, A.ATTRNAME, A.ATTRCOMPONENT, A.ATTR_ID, VALUE_CHAR, VALUE_INT, VALUE_DOUBLE, VALUE_DATE, VALUE_ID, A.ATTRVALUE1, "
        + " A.ATTRVALUE2, B.ATTRVALUE1, B.ATTRVALUE2, B.ATTRNAME, A.SQLIDCOLUMN, A.SQLSHOWCOLUMN, A.SQLFROMDEF , A.SQLWHERE, A.ATTRID, C.ATTRNAME "
        + " from ATTRLINK join ATTR A on ATTRLINK.ATTR_ID = A.ATTRID left join ATTR B on A.ATTR_ID = B.ATTRID left join ATTR C on C.ATTRID = VALUE_ID where " + condition 
        + " order by B.ATTRSORT, A.ATTRSORT", a.SQL_COMPLETE);

    for ( i = 0; i < attr_value.length; i++)
    {
        tab[i] = new Array();
        tab[i][0] = attr_value[i][0];
        // Schriftfarbe, Hintergrundfarbe
        if ( attr_value[i][3] != "")  //  Wenn ATTR_ID leer dann für 1. Attribut 
        {
            tab[i][1] = attr_value[i][11];
            tab[i][2] = attr_value[i][12];
        }
        else
        {
            tab[i][1] = attr_value[i][9];
            tab[i][2] = attr_value[i][10];
        }
        if (attr_value[i][3] == "")  // Wenn ATTR_ID leer dann nur 1. Attribut 
        {
            if ( pOriginal )  tab[i][3] = attr_value[i][18];
            else		tab[i][3] =  a.translate(attr_value[i][1]);
            tab[i][4] = ""
        }
        else // 2. Attribute vorhanden
        {
            if ( pOriginal )
            {
                tab[i][3] = attr_value[i][3];
                tab[i][4] = attr_value[i][18];
            }
            else
            {
                tab[i][3] =  a.translate(attr_value[i][13]);
                tab[i][4] =  a.translate(attr_value[i][1]);
            }
        }
        // Datenfeld anzeigen abhänging von ATTRCOMPONENT
        switch ( parseInt(attr_value[i][2]) )
        {
            case 1:  // Combobox
                if ( attr_value[i][8] != "")
                {
                    if ( pOriginal ) tab[i][5] = attr_value[i][8];
                    else tab[i][5] = a.translate( attr_value[i][19] );
                }
                else tab[i][5] = "";
                break;
            case 2: // Stringfeld
                tab[i][5] = attr_value[i][4];
                break;
            case 3: // Checkbox
                if ( pOriginal ) tab[i][5] = attr_value[i][4];
                else
                {
                    if (attr_value[i][4] == "Y") tab[i][5] = a.translate("Ja"); 
                    else tab[i][5] = a.translate("Nein"); 
                }
                break;
            case 4: // Datumsfeld
                if ( pOriginal ) tab[i][5] = attr_value[i][7];
                else	tab[i][5] =  a.longToDate(attr_value[i][7],"dd.MM.yyyy");
                break;
            case 5: // Zahlenfeld
                if ( pOriginal ) tab[i][5] = attr_value[i][5];
                else	tab[i][5] = a.formatLong(attr_value[i][5], "#,##0");
                break;
            case 6: // Kommafeld
                if ( pOriginal ) tab[i][5] = attr_value[i][6];
                else	      tab[i][5] = a.formatDouble(attr_value[i][6], "#,##0.00");
                break;
            case 7:  // SelectCombobox
                if ( attr_value[i][8] != "")
                {
                    if ( pOriginal ) tab[i][5] = attr_value[i][8];
                    else
                    {
                        var sql = "select " + concat( attr_value[i][15].split(",")  ) 
                        + " from " + attr_value[i][16] + " where " + attr_value[i][14] + " = '" + attr_value[i][8] + "' ";
					
                        if(attr_value[i][17] != "")  // if we have a SQLWEHERE definition in the attr declaration
                        {
                            sql += " AND (" + attr_value[i][17] + " )";
                        }
                        tab[i][5] = a.translate( a.sql( resolveFunction( a.resolveVariables( sql ) ) ) );						
                    }
                }
                else  
                {
                    tab[i][5] = "";
                }
                break;
        }
    }
    return tab;
}

/*
* Gibt die Werte für das Audting zurück.
*
* @param {String} pAttrID req ATTRID 
* @param {String} pAttrValue req Datenwert
* @return {[]}  AttributName, Wert
*/
function GetAttrAudit( pAttrID, pAttrValue )
{
    var sqlstr = "SELECT A.ATTRNAME, A.ATTRCOMPONENT, A.ATTR_ID, A.ATTRVALUE1, A.ATTRVALUE2, "
    + " B.ATTRVALUE1, B.ATTRVALUE2, B.ATTRNAME, A.SQLIDCOLUMN, A.SQLSHOWCOLUMN, A.SQLFROMDEF , A.SQLWHERE, A.ATTRID, C.ATTRNAME "
    + " from ATTR A left join ATTR B on A.ATTR_ID = B.ATTRID left join ATTR C on C.ATTRID = '" + pAttrValue 
    + "' where A.ATTRID = '" + pAttrID + "'";

    var attr_value = a.sql(sqlstr, a.SQL_ROW);
    ret = new Array();
    if (attr_value[2] == "")  // Wenn ATTR_ID leer dann nur 1. Attribut 
    {
        ret[0] =  a.translate(attr_value[0]);
    }
    else // 2. Attribute vorhanden
    {
        ret[0] = a.translate(attr_value[7]) + "." + a.translate(attr_value[0]);
    }
    
    // Datenfeld anzeigen abhänging von ATTRCOMPONENT
    switch ( parseInt(attr_value[1]) )
    {
        case 1:  // Combobox
            ret[1] = a.translate( attr_value[13] );
            break;
        case 2: // Stringfeld
            ret[1] = pAttrValue;
            break;
        case 3: // Checkbox
            if (pAttrValue == "Y") ret[1] = a.translate("Ja"); 
            else ret[1] = a.translate("Nein"); 
            break;
        case 4: // Datumsfeld
            ret[1] =  a.longToDate(pAttrValue,"dd.MM.yyyy");
            break;
        case 5: // Zahlenfeld
            ret[1] = a.formatLong(pAttrValue, "#,##0");
            break;
        case 6: // Kommafeld
            ret[1] = a.formatDouble(pAttrValue, "#,##0.00");
            break;
        case 7:  // SelectCombobox
            var sql = "select " + concat( attr_value[9].split(",")  ) 
            + " from " + attr_value[10] + " where " + attr_value[8] + " = '" + pAttrValue + "' ";
            if(attr_value[11] != "")  // if we have a SQLWEHERE definition in the attr declaration
            {
                sql += " AND (" + attr_value[11] + " )";
            }
            ret[1] = a.translate( a.sql( resolveFunction( a.resolveVariables( sql ) ) ) );	
            break;
    }
    return ret;
}

/*
* Löst Funktion auf.
*
* @param {String} pString req Funktionsname
* @version EP 19012012 case "getUsersWithAnyRole hinzugefügt
*
* @return {String} 
*/
function resolveFunction( pString )
{
    var pstr = getPart( pString, "{", "}" );
    if ( pstr != "" )
    {
        param = getPart( pstr, "(", ")" );
        if ( param != "")
        {
            funct = pstr.replace( param, "" );
            funct = trim(funct.substr( 1, funct.length - 2 ));
            switch(funct)
            { 
                case "getUsersWithRole":
                    pString = pString.replace( pstr, "'" + tools.getUsersWithRole( trim(param.substr( 1, param.length - 2)) ).join("', '") + "'");
                    break;
                case "getUsersWithAnyRole": 
                {
                    var roleArray = trim( param.substr( 1, param.length - 2 ) ).split(",");
                    for( var i = 0; i < roleArray.length; i++ ) roleArray[i] = trim( roleArray[i] );
                    pString = pString.replace( pstr, "'" + tools.getUsersWithAnyRole( roleArray ).join("', '") + "'" );
                }
                break;
            }
        }	
    }
    return pString;
	
    /*
	*
	* Schneidet einen String aus einer Zeichenkette anhand eines Anfangs- 
				und eines Endzeichens aus und gibt diesen zurück
	*
	* @param {String} pStr req Zeichenkette von der ein Teil ausgeschnitten werden soll
	* @param {String} pAnfTZ req Anfangszeichen des auszuschneidenden Teils
	* @param {String} pEndTZ req Endzeichen des auszuschneidenden Teils
	*
	* @return {String}
	*/
    function getPart( pStr, pAnfTZ, pEndTZ )
    {
        var part = "";
        var anf = pStr.indexOf(pAnfTZ);
        var end = pStr.indexOf(pEndTZ);
        if ( anf != -1 && end != -1 )		part = pStr.substring( anf, end + 1);
        return part;
    }
}
/*
* Überprüft, ob der Wert des Attributes der RegEx
			validiert werden kann.
*
* @param {String} pAttributeID req das zu prüfende Attribute
* @param {String} pValue req der zu prüfende Wert
*
* @return {Boolean} true, wenn der Ausdruck valide ist, andernfalls false
*/
function doAttrValidation(pAttributeID, pValue)
{
    var regex = a.sql("select attrdatadefinition from attr where attrid = '"  + pAttributeID + "'");
    var ret = validate(pValue, regex);
    if (ret == false) a.showMessage(a.translate("Der angegebene Wert ist nicht gültig!"));
    return ret;
}

/*
* Überprüft, ob der übergebene Wert gegenüber der übergebenen RegEx
			validiert werden kann.
*
* @param {String} pWert req der zu prüfende Wert
* @param {String} pRegex req die RegEx gegen die validiert werden soll
* 
* @return {String} true, wenn der Ausdruck valide ist, false andernfalls
*/
function validate(pWert, pRegex)
{
    if (pRegex == undefined || pRegex == "")
    {
        return true;
    }
    else
    {
        var match = pWert.search("^" + pRegex + "$");
        if (match != -1)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

/*
* Überprüft die minimale/maximale Anzahl der Attribute
*
* @param {Integer} pType opt KeyValue from Keyword
*
* @return {void}
*/
function checkAttrCount( pType )
{
    var message = "";
    var condition = " where ( MINCOUNT > 0 or MAXCOUNT > 0 ) and ATTROBJECT = " + a.valueofObj("$image.FrameID"); 
    if (pType != "" && pType != undefined) condition += " and ( ATTROBJECT.KEYVALUE IS NULL or ATTROBJECT.KEYVALUE in (" + pType + "))";
    else if (pType == "" ) condition += " and ATTROBJECT.KEYVALUE IS NULL";

    var attrobject = a.sql("select A1.ATTRID, MINCOUNT, MAXCOUNT, A1.ATTRNAME, A2.ATTRNAME, A2.ATTRID from ATTROBJECT join  ATTR A1 on (ATTROBJECT.ATTR_ID = A1.ATTRID) " 
        + " left join ATTR A2 on (A1.ATTR_ID = A2.ATTRID) " + condition, a.SQL_COMPLETE);
	
    var attrdata = a.getTableData("$comp.classification", a.ALL);
    for (var i=0; i< attrobject.length; i++)
    {
        var attrname = a.translate(attrobject[i][3]);
        if ( attrobject[i][4] != "" )		attrname =  a.translate(attrobject[i][4]) + "." + attrname;
        // anzahl pro Attribute
        var count = 0;
        var emptycount = 0;
        for ( var y = 0; y < attrdata.length; y++ )	
        {
            if ( attrobject[i][0] == attrdata[y][3] || attrobject[i][0] == attrdata[y][4] )
            {
                if ( attrdata[y][5] != null && attrdata[y][5] != "" )	count++; // Eintrag
                else	emptycount++;  // Leereintrag
            }				
        }
        var mincount = eMath.absInt( attrobject[i][1] ); 
        if ( count < mincount )
        {
            message += a.translate("Das Attribut '%0' muss mindestens %1 mal angegeben werden!", [ attrname, mincount ]) + "\n";
            // Pflichtattribute anlegen
            for ( y = emptycount + count; y < mincount; y++ )
            {
                a.setFocus("$comp.classification");
                var id = a.addTableRow("$comp.classification");
                if ( attrobject[i][4] != "" )  // zweistufiges Attribute
                {	
                    a.updateTableCell("$comp.classification", id, 3, attrobject[i][5], a.translate(attrobject[i][4]));
                    a.updateTableCell("$comp.classification", id, 4, attrobject[i][0], a.translate(attrobject[i][3]));
                }
                else   // einstufiges Attribut
                {
                    a.updateTableCell("$comp.classification", id, 3, attrobject[i][0], a.translate(attrobject[i][3]));
                }
            }
        }
        var maxcount = eMath.absInt( attrobject[i][2] ); 
        if ( count > maxcount && maxcount > 0 )
        {
            message += a.translate("Das Attribut '%0' darf maximal %1 mal angegeben werden!", [ attrname, maxcount ]) + "\n";
        }
    }			
    if ( message != "" ) 
    {
        a.setFocus("$comp.classification");
        a.showMessage( message );
    }
    return ( message == "");		
}

/*
* Gibt Feldname zurück.
* 
* @param {String} pAttrID req
*
* @return {String} FieldName
*/
function getValueFieldName( pAttrID )
{
    var fields = new Array( "VALUE_ID", "VALUE_CHAR", "VALUE_CHAR", "VALUE_DATE","VALUE_INT","VALUE_DOUBLE", "VALUE_ID");
    var	component = parseInt(a.sql("select attrcomponent from attr where attrid = '" + pAttrID + "'") );
    return fields[component -1];
}

/*
* Gibt Objekt für sqlInsert zurück.
* 
* @return {Object} für sqlInsert
*/
function getAttrLinkObject()
{
    var fields = new Array("ATTR_ID", "VALUE_CHAR","VALUE_DATE","VALUE_INT","VALUE_DOUBLE", "VALUE_ID","ATTRLINKID", "ROW_ID", "OBJECT_ID", "DATE_NEW", "DATE_EDIT", "USER_NEW");
    var types = a.getColumnTypes("ATTRLINK", fields);
    var attrvalues = new Array("", "", "", "", "", "", "", "", "", a.valueof("$sys.date"), a.valueof("$sys.date"), a.valueof("$sys.user"));
    return new Array("ATTRLINK",	fields, types, attrvalues );
}

/*
* Gibt die Werte für ATTRLINK zurück.
*
* @param {Object []} pAttrObject req
* @param {String []} pAttrValues req Array von Werten (attributelist1,attributelist2,cbx_attrvalue,string_attrvalue,chk_attrvalue,date_attrvalue,int_attrvalue,float_attrvalue)
*
* @return {Object []}
*/
function getAttrLinkValues( pAttrObject, pAttrValues )
{
    var attribute1 = pAttrValues[0];
    var attribute2 = pAttrValues[1];
    var attribute = attribute1;
    if (attribute1 != "")
    {
        // attrvalue inhalt löschen
        for ( var i = 1; i < 6; i++ ) 
            pAttrObject[3][i] = "";			
        if (attribute2 != "") attribute = attribute2;
        component = parseInt(a.sql("select attrcomponent from attr where attrid = '" + attribute + "'"));
        switch (component)
        {
            case 1:
            case 7:
                pAttrObject[3][5] = pAttrValues[2];
                break;
            case 2:
            case 3:
                pAttrObject[3][1] =  pAttrValues[component+1];
                break;
            case 4:
                pAttrObject[3][2] =  pAttrValues[component+1];
                break;
            case 5:
                pAttrObject[3][3] =  pAttrValues[component+1];
                break;			
            case 6:
                pAttrObject[3][4] =  pAttrValues[component+1];	
        }
        pAttrObject[3][0] = attribute;
    }
    return pAttrObject;
}

/*
* Legt ein neuen DS in ATTRLINK an.
*
* @param {[]} pAttrObject req
* @param {[]} pAttrValues req Array von Werten (attributelist1,attributelist2,cbx_attrvalue,string_attrvalue,chk_attrvalue,date_attrvalue,int_attrvalue,float_attrvalue)
* @param {String} pRowID req RowID des Datensatzes
* @param {String} pObjectID req ObjectID des Frames
*
* @return {void}
*/
function setAttrLinkValues( pAttrObject, pAttrValues, pRowID, pObjectID )
{
    var attrobject = getAttrLinkValues( pAttrObject, pAttrValues );
    attrobject[3][7] = pRowID;
    attrobject[3][8] = pObjectID;
    attrobject[3][6] = a.getNewUUID();
    a.sqlInsert(  Array (attrobject) );
}

/*
* Legt einen neuen DS in ATTRLINK an.
*
* @param {String} pAttrID
* @param {String} pAttrValue 
* @param {String} pRowID req RowID des Datensatzes
* @param {String} pObjectID req ObjectID des Frames
*
* @return {void}
*/
function setAttribute( pAttrID, pAttrValue, pRowID, pObjectID )
{
    var attribute = a.sql( "select attrcomponent, ATTRNAME from ATTR where ATTRID = '" + pAttrID + "'", a.SQL_ROW );
    var AttrObj = getAttrLinkObject();
    switch ( parseInt(attribute[0]))
    {
        case 1:
        case 7:
            AttrObj[3][5] = pAttrValue;
            break;
        case 2:
        case 3:
            AttrObj[3][1] =  pAttrValue;
            break;
        case 4:
            AttrObj[3][2] =  pAttrValue;
            break;
        case 5:
            AttrObj[3][3] =  pAttrValue;
            break;			
        case 6:
            AttrObj[3][4] =  pAttrValue;	
    }
    AttrObj[3][0] = pAttrID;
    AttrObj[3][7] = pRowID;
    AttrObj[3][8] = pObjectID;
    AttrObj[3][6] = a.getNewUUID();
    a.sqlInsert(  Array (AttrObj) );
}

/*
* Liefert die Liste des Attribut1
*
* @param {String} pFrameID reg ID des Frames
* @param {Integer} pType opt Keyvalue des KEYWORDS
* 
* @return {Attribute1}
*/
function getAttrList_First(pFrameID, pType)
{
    var attrlist = [];
    var condition = "ATTR.ATTR_ID is null and ATTROBJECT = " + pFrameID;  
	
    if (pType != "" && pType != undefined) condition += " and ( ATTROBJECT.KEYVALUE IS NULL or ATTROBJECT.KEYVALUE in (" + pType + "))";
    else if (pType == "" ) condition += " and ATTROBJECT.KEYVALUE IS NULL";
	
    condition = getGrantCondition("ATTRIBUTES", condition, "ATTRID", "EDIT");
    if(condition != "") condition = " where " + condition;
    var list = new Array();
    list = a.sql("select ATTRID, ATTRNAME, MAXCOUNT from ATTR join ATTROBJECT on (ATTR.ATTRID = ATTROBJECT.ATTR_ID) " 
        + condition + " and AOACTIVE = 1 order by ATTRSORT", a.SQL_COMPLETE);
    var attrcount = [];
    var attrdata = a.getTableData("$comp.classification", a.ALL);
    var aktattrid = a.decodeFirst(a.valueof("$comp.classification"));
    for ( var i = 0; i < attrdata.length; i++ )
    {
        if ( attrcount[ attrdata[i][3] ] == undefined ) attrcount[ attrdata[i][3] ] = 1;
        else  attrcount[ attrdata[i][3] ]++;
        if (  attrdata[i][0] == aktattrid )  attrcount[ attrdata[i][3] ]--;
    }		
    for ( i = 0; i < list.length; i++ )
    {
        // MAXCOUNT berücksichtigen
        if (  attrcount[ list[i][0] ] == undefined || list[i][2] == "" || list[i][2] > attrcount[ list[i][0] ] || a.valueof("$sys.workingmode") == a.FRAMEMODE_TABLE)	
            attrlist.push( [ list[i][0], a.translate( list[i][1] ) ] ); 
    }
    return attrlist;
}

/*
* Liefert die Liste des Attribut2
*
* @param {String} pAttribute reg ID des Attributs
* @param {String} pFrameID req ID des Frames
* @param {Integer} pType opt Keyvalue des KEYWORDS
*
* @return {Attribute2}
*/
function getAttrList_Second( pAttribute, pFrameID, pType )
{
    var condition;
    var i;
    var attrlist = [];
    if (pAttribute != "")
    {
        var component = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + pAttribute + "'");
        if (component == "0")
        {
            condition = "ATTROBJECT = " + pFrameID + " and ATTR.ATTR_ID = '" + pAttribute + "'";
            if (pType != "" && pType != undefined) condition += " and ( ATTROBJECT.KEYVALUE IS NULL or ATTROBJECT.KEYVALUE in (" + pType + "))";
            else if (pType == "" ) condition += " and ATTROBJECT.KEYVALUE IS NULL";
            condition = getGrantCondition("ATTRIBUTES", condition, "ATTRID", "EDIT");
            var list = a.sql("select ATTRID, ATTRNAME, MAXCOUNT from ATTR join ATTROBJECT on (ATTRID = ATTROBJECT.ATTR_ID) where "
                + condition + " and AOACTIVE = 1 order by ATTRSORT", a.SQL_COMPLETE);
            var attrcount = [];
            var attrdata = a.getTableData("$comp.classification", a.ALL);
            var aktattrid = a.decodeFirst(a.valueof("$comp.classification"));
            for (i = 0; i < attrdata.length; i++ )
            {
                if ( attrcount[ attrdata[i][4] ] == undefined ) attrcount[ attrdata[i][4] ] = 1;
                else  attrcount[ attrdata[i][4] ]++;
                if (  attrdata[i][0] == aktattrid )  attrcount[ attrdata[i][4] ]--;
            }		
            for (i = 0; i < list.length; i++ )
            {
                // MAXCOUNT berücksichtigen
                if (  attrcount[ list[i][0] ] == undefined || list[i][2] == "" || list[i][2] > attrcount[ list[i][0] ] || a.valueof("$sys.workingmode") == a.FRAMEMODE_TABLE )	
                    attrlist.push( [ list[i][0], a.translate( list[i][1] ) ] ); 
            }
        }
    }
    return attrlist;
}

/*
* Gibt ein Array für die Suchliste zurück
*
* @param {Integer} pComponent req Componente des Attributs
* 
* @return {[]}
*/

function getAttrSearchFields( pComponent )
{
    var FrameID = a.valueofObj("$image.FrameID")
    var searchfields = new Array();
    var attr = a.sql("select ATTRID from ATTR where " + getGrantCondition("ATTRIBUTES", "AOACTIVE = 1", "ATTRID"), a.SQL_COLUMN);
    var list = a.sql( "SELECT distinct AFirst.ATTRID, AFirst.ATTRNAME, ASecond.ATTRID, ASecond.ATTRNAME, ASecond.SQLWHERE from ATTR ASecond "
        + " left join ATTR AFirst on ASecond.ATTR_ID = AFirst.ATTRID and AFirst.ATTRID in ('" + attr.join("', '") + "')"
        + " join ATTROBJECT on ATTROBJECT.ATTR_ID = ASecond.ATTRID and ATTROBJECT = " + FrameID 
        + " where ASecond.ATTRCOMPONENT in (" + pComponent + ") and ASecond.ATTRID in ('" + attr.join("', '") + "')", a.SQL_COMPLETE);						
    for (var z = 0; z < list.length; z++)
    {
        // gilt für SelectCombo: wenn ASecond.SQLWHERE den String '$comp.' enthält soll dieses Attribut nicht in der Suchtabelle erscheinen,
        // da in diesem Fall die Wertetabelle nicht gefüllt werden kann, da auf ein Oberflächenfeld zugegriffen wird / PK 22.8.2011
        if ( list[z][4].indexOf("$comp.") == -1 ) 
        {
            if ( list[z][0] == "" )
                searchfields.push( [list[z][2], a.translate( list[z][3] ), [], true] );
            else
                searchfields.push( [list[z][0], a.translate( list[z][1] ), [ [ list[z][2], a.translate( list[z][3] ) ] ], false] );
        }
    }
    return(searchfields);
}

/*
* Gibt ein Array der ATTRNamen zurück
*
* @param {String} pObjectID req ObjectID des Frames
* 
* @return {[]}
*/
function getAttrNames( pObjectID )
{
    var attrname = new Array();
    var firstcond = getGrantCondition("ATTRIBUTES", "", "AFirst.ATTRID");
    var condition = getGrantCondition("ATTRIBUTES", "ASecond.AOACTIVE = 1 ", "ASecond.ATTRID");
    if ( firstcond != "" ) condition += " and " + firstcond;
    var list = a.sql("SELECT distinct AFirst.ATTRID, AFirst.ATTRNAME, ASecond.ATTRID, ASecond.ATTRNAME from ATTR ASecond "
        + " left join ATTR AFirst on ASecond.ATTR_ID = AFirst.ATTRID and AFirst.AOACTIVE = 1 " 
        + " join  ATTROBJECT on ATTROBJECT.ATTR_ID = ASecond.ATTRID and ATTROBJECT = " + pObjectID 
        + " where " + condition, a.SQL_COMPLETE);
    for (var z = 0; z < list.length; z++)
    {
        if ( list[z][0] == "" )	attrname.push( [list[z][2], a.translate( list[z][3]) ] );
        else 	attrname.push( [list[z][2], a.translate( list[z][1] ) + "." + a.translate( list[z][3] ) ] );
    }
    return(attrname);
}
/*
* Gibt Suchformel für Attribute zurück
*
* @return {String}
*/
function getAttrSearchLink()
{
    var attribute1;
    var attribute2;
    var frame = a.valueofObj("$image.Frame")
    var inopt = " in ";
    var condition = " where ";
    if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_TABLE )
    {
        var selection = a.decodeMS(a.valueof("$local.selection"));
        attribute1 = selection[0];
        attribute2 = selection[1];
    }
    else
    {
        attribute1 = a.valueof("$comp.attributelist1");
        attribute2 = a.valueof("$comp.attributelist2");
    }
    if (attribute2 != "" && attribute2 != undefined)	value = attribute2;
    else if (attribute1 != "")	 value = attribute1;
    if ( a.valueofObj("$local.value") == null ) condition += a.valueof("$local.condition");
    else condition += a.valueof("$local.condition").replace("<>", " = ") + " and " + a.valueof("$local.value") + " = " + a.valueof("$local.value");
    if(a.valueof("$local.operator") == "2") inopt = " not in " 
    return frame.Table + "." + frame.IDColumn + inopt + " (select " + frame.IDColumn + " from " + frame.Table + " left join ATTRLINK on OBJECT_ID = " 
            + frame.Id + " and ATTRLINK.ROW_ID = " + frame.IDColumn + " and ATTR_ID = '" + value + "'" + condition + ")";    
}			
		
/*
* Gibt den Wert des Attributs zurück
*
* @param {String} pAttributeEins req ID des ersten Attributs
* @param {String} pAttributeZwei req ID des zweiten Attributs
* @param {Integer} pActValue opt Value der Combobox
* 
* @return {AttributeValue}
*/
function getAttrValue( pAttributeEins, pAttributeZwei, pActValue )
{
    var list =  new Array();
    var attribute = "";
    var i;
    var component = "";
    if (pAttributeEins != "")
    {
        var condition = "";
        var compfirst = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + pAttributeEins + "'");
        if (compfirst == 0) attribute = pAttributeZwei
        else  attribute = pAttributeEins;
        attr = a.sql("select ATTRCOMPONENT, SQLIDCOLUMN, SQLSHOWCOLUMN, SQLFROMDEF, SQLWHERE, SQLORDER from ATTR where ATTRID = '" + attribute + "'", a.SQL_ROW);
        if ( pActValue != undefined && a.valueof("$sys.workingmode") != a.FRAMEMODE_TABLE )
        {
            var except = [];
            var attrdata = a.getTableData("$comp.classification", a.ALL);
            for (i = 0; i < attrdata.length; i++ )
            {
                if ( attrdata[i][4] == attribute && attrdata[i][5] != pActValue )  except.push( attrdata[i][5] );
            }		
            if ( except.length > 0 )  condition = " not in ('" + except.join("', '")  + "')";
        }	
        switch(attr[0])
        {
            case "1":  // Combobox
                if ( condition )  condition = " and ATTRID " + condition;
                list = a.sql("select ATTRID, ATTRNAME from ATTR where ATTR_ID = '" + attribute + "'" + condition + " order by ATTRSORT", a.SQL_COMPLETE);
                for (i = 0; i < list.length; i++ ) list[i][1] = a.translate( list[i][1] );
                break;
            case "7":  // SelectCombobox
                if ( condition )  condition = attr[1] + condition;
                if ( attr[4] != "" ) 
                {
                    if ( condition )  condition += " and ";
                    condition += attr[4]; 					
                }
                sql = "select " + attr[1] + ", " + concat( attr[2].split(",")  ) + " from " + attr[3];
                if ( condition ) sql += " where " + condition;	
                if ( attr[5] != "" ) sql += " order by " +  attr[5];
                list = a.sql( resolveFunction( a.resolveVariables( sql ) ), a.SQL_COMPLETE );
                for (i = 0; i < list.length; i++ ) list[i][1] = a.translate( list[i][1] );
                break;
        }
    }
    return list;
}

/*

* Überprüft ob das Recht vorhanden ist einen neuen Datensatz anzulegen.
*
* @param {Integer} pWorkingmode req 
* @param {String} pID1 req ID des ersten Attributs
* @param {String} pID2 req ID des zweiten Attributs
* @param {String} pPrivMode req "priv_edit" oder "priv_delete"
* 
* @return true wenn die Rechte vorhanden sind, false wenn nicht
*/
function Button_Activity( pWorkingmode, pID1, pID2, pPrivMode )
{
    var attr1 = isgranted("insert");
    var attr2 = isgranted("insert");
    return((pWorkingmode == a.FRAMEMODE_NEW || pWorkingmode == a.FRAMEMODE_EDIT) && attr1 != "false" && attr2 != "false" );
}

/*
* Erzeugt über einen Dialog Attributeinträges für die angegebenen ROW_IDS
*
* @param {String} pRowsSqlStr req  SQLString 
* @param {String} pObjectID req  Objectid
* @param {bollean} pDelete opt  löschen
*
* @return {void}
*/

function runAttr( pRowsSqlStr, pObjectID, pDelete )
{
    var i;
    var rows;
    var iscount;
    // Attribut-Componenten
    var attrcomp = new Array("attributelist1","attributelist2","cbx","string","chk","date","int","float");
    a.localvar( "$local.objectid", pObjectID );
	   		
    var ergebnis = a.askUserQuestion("", "DLG_CHOOSE_ATTRIBUTE");
    if ( ergebnis != null )
    {
        var attrvalues = new Array()
        for (i = 0; i < attrcomp.length; i++)
        {
            attrvalues[i] = ergebnis["DLG_CHOOSE_ATTRIBUTE." + attrcomp[i]]
        }
        if (attrvalues[0] != "")
        {
            // Werte zuordnen
            var attrcond = "";
            var attrobject = getAttrLinkValues( getAttrLinkObject(), attrvalues );
            // gefüllte Feld ermitteln
            for (i=1; i < 6; i++)
            {
                if ( attrobject[3][i] != "" )	
                {
                    switch (i)
                    {
                        case 1:
                        case 5:
                            attrcond = attrobject[1][i] + " = '" + attrobject[3][i] + "'";
                            break;
                        case 2:
                            attrcond = getTimeCondition( attrobject[1][i] , "=" , attrobject[3][i] );
                            break;
                        default:
                            attrcond = attrobject[1][i] + " = " + attrobject[3][i];
                    }
                    break;
                }
            }
            if ( attrcond != "" )
            {
                if ( pDelete == true )
                {
                    // RowIDs ermittel die das Attribut noch nicht haben
                    rows = a.sql( pRowsSqlStr + " in ( select ROW_ID from ATTRLINK where ATTR_ID = '" + attrobject[3][0]  + "' and OBJECT_ID = " 
                        + pObjectID + " and " + attrcond + " )", a.SQL_COLUMN);
                    // Mainimale Anzahl des Attributs pro Datensatz
                    var mincount = parseInt(a.sql("select MINCOUNT from ATTROBJECT where ATTROBJECT = " + pObjectID
                        + " and ATTR_ID = '" + attrobject[3][0] + "'"));
                    if ( mincount != "" ) mincount = 0;
                    if ( rows.length > 0 )		
                        if ( a.askQuestion(rows.length + " " + a.translate("mal ausgewähltes Attribut löschen ?"), a.QUESTION_YESNO, "") == "true" )
                        {	
                            for (i=0; i < rows.length; i++)
                            {
                                iscount = parseInt(a.sql("select count(*) from ATTRLINK where ATTR_ID = '" + attrobject[3][0] 
                                    + "' and ROW_ID = '" +  rows[i] + "' and OBJECT_ID = " + pObjectID ));
                                if  (iscount > mincount)
                                {
                                    attrobject[3][7] = rows[i];
                                    a.sqlDelete("ATTRLINK", "ATTR_ID = '" + attrobject[3][0]	+ "' and ROW_ID = '" +  rows[i] + "' and OBJECT_ID = " + pObjectID + " and " + attrcond);
                                }
                            }
                        }
                }
                else
                {
                    // RowIDs ermittel die das Attribut noch nicht haben
                    rows = a.sql( pRowsSqlStr + " not in ( select ROW_ID from ATTRLINK where ATTR_ID = '" + attrobject[3][0]  + "' and OBJECT_ID = " 
                        + pObjectID + " and ROW_ID is not null and " + attrcond + " )", a.SQL_COLUMN);
			
                    // Maximale Anzahl des Attributs pro Datensatz
                    var maxcount = a.sql("select MAXCOUNT from ATTROBJECT where ATTROBJECT = " + pObjectID 
                        + " and ATTR_ID = '" + attrobject[3][0] + "'");
                    if ( maxcount == "" ) maxcount = 9999;
                    if ( rows.length > 0 )		
                        if ( a.askQuestion(rows.length + " " + a.translate("mal ausgewähltes Attribut hinzufügen ?"), a.QUESTION_YESNO, "") == "true" )
                        {	
                            attrobject[3][8] = pObjectID;
                            for (i=0; i < rows.length; i++)
                            {
                                iscount = parseInt(a.sql("select count(*) from ATTRLINK where ATTR_ID = '" + attrobject[3][0] 
                                    + "' and ROW_ID = '" +  rows[i] + "' and OBJECT_ID = " + pObjectID ));
                                if  (iscount < Number(maxcount))
                                {
                                    attrobject[3][7] = rows[i];
                                    attrobject[3][6] = a.getNewUUID();
                                    a.sqlInsert( [attrobject] );
                                }
                            }
                        }
                }
            }
            else a.showMessage(a.translate("Kein Attribut ausgewählt !"))
        }
    }
}

/*
* Speichern der neuen Attribute
* 
* @return {void}
*/
function insertAttr()
{
    var row = a.valueofObj("$local.rowdata");
    if ( row[5] != null && row[5] != "")
    {
        var attribute = "";
        if ( row[4] != null && row[4] != "") 		attribute = row[4];
        else 		attribute = row[3];
        var field = new Array("VALUE_ID","VALUE_CHAR","VALUE_CHAR","VALUE_DATE","VALUE_INT","VALUE_DOUBLE","VALUE_ID");
        var component = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + attribute + "'");
        var cols = new Array("ATTRLINKID", "ATTR_ID", "ROW_ID", "OBJECT_ID", "DATE_NEW", "USER_NEW", field[component - 1]);
        var vals = new Array(a.getNewUUID(), attribute, a.valueof("$comp.idcolumn"), a.valueof("$image.FrameID"), a.valueof("$sys.date"), a.valueof("$sys.user"), row[5]);
        var colTypes = a.getColumnTypes("ATTRLINK", cols);
		
        a.sqlInsert("ATTRLINK", cols, colTypes, vals);
    }
}

/*
* Update Attribute
*
* @return {void}
*/
function updateAttr()
{
    var row = a.valueofObj("$local.rowdata");
    if ( row[5] != null && row[5] != "")
    {	
        var id = row[0];
        var content = a.getTableData("comp.classification", [id])[0];	
        var attribute = "";
        if (content[4] != null && content[4] != "") 	attribute = content[4];
        else 	attribute = content[3];
        var field = new Array("VALUE_ID","VALUE_CHAR","VALUE_CHAR","VALUE_DATE","VALUE_INT","VALUE_DOUBLE","VALUE_ID");
        var component = a.sql("select ATTRCOMPONENT from ATTR where ATTRID = '" + attribute + "'");
        var cols = new Array( "ATTR_ID", "DATE_EDIT", "USER_EDIT", field[component - 1]);
        var vals = new Array( attribute, a.valueof("$sys.date"), a.valueof("$sys.user"), row[5]);
        var colTypes = a.getColumnTypes("ATTRLINK", cols);

        a.sqlUpdate("ATTRLINK", cols, colTypes, vals, "ATTRLINKID = '" + row[0] + "'");
    }
    else	a.sqlDelete("ATTRLINK", "ATTRLINKID = '" + row[0] + "'");
}
