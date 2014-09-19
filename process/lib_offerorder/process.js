import("lib_email");
import("lib_attr");
import("lib_calendar");
import("lib_keyword");
import("lib_util");
import("lib_sql");
import("lib_relation");

/*
* Fügt Sückliste einer Position ein 
* 
* @return {void}
*/
function insertOfferPosition()
{ 
    var pricelist = GetAttributeKey( "Preisliste", 1, a.valueof("$comp.relorgid") )[0];
    if ( pricelist == undefined) pricelist = 1;// Standardpreisliste    
    var aktdate = a.valueof("$sys.date");
    var itemid = a.valueof("$comp.OFFERITEMID");
    var offerid = a.valueof("$comp.OFFER_ID");
    var user = a.valueof("$sys.user");
    var productid = a.valueof("$comp.PRODUCT_ID");
    var pos = a.valueof("$comp.ITEMPOS");
    var language = a.valueof("$comp.edt_language");
    if (language == "") language = 1;
    var currency = a.valueof("$comp.currency");
    var cfields = ["OFFERITEMID", "OFFER_ID" ,"GROUPCODEID", "ITEMNAME", "DESCRIPTION", "ASSIGNEDTO", "ITEMPOSITION", 
    "PRODUCT_ID", "PRICE", "UNIT", "QUANTITY", "VAT", "OPTIONAL", "DATE_NEW", "USER_NEW"]; 
    var ctypes = a.getColumnTypes( "OFFERITEM", cfields);
    var statements = [];
    
    __insPos( productid, itemid, pos );
    // recursive Function
    function __insPos( pProdID , pItemID, pPos )
    {
        var plist = a.sql("select PRODUCTID, GROUPCODEID, PRODUCTNAME, TEXTBLOCK.LONG_TEXT, PRODUCTCODE, QUANTITY, OPTIONAL, PROD2PRODID, "
            + " TAKEPRICE, UNIT, TEXTBLOCK.SHORTTEXT from PRODUCT join PROD2PROD on PRODUCTID = SOURCE_ID and DEST_ID = '" + pProdID + "'" 
            + " left join TEXTBLOCK on (AOTYPE = 1 and TABLENAME = 'PRODUCT' and ROW_ID = PRODUCTID and TEXTBLOCK.LANG = " + language + ")"
            + " order by PRODUCTCODE", a.SQL_COMPLETE);

        for(var i=0; i < plist.length; i++)
        {
            var assigneto = pItemID;
            var pricedata = ["","","",""];
            // Gehört nicht zum Paket daher Preis 
            if ( plist[i][8] == 1 )     
            {    
                assigneto = ""; 
                pricedata = getPrice( plist[i][0], currency, pricelist, plist[i][5] );            
            }            
            if ( plist[i][10] != "" )    plist[i][2] =  plist[i][10];
            var itempos =  pPos + "." + (i + 1);
            var newitemid =  a.getNewUUID();

            var cvalues = [ newitemid, offerid, plist[i][1], plist[i][2], plist[i][3], assigneto, itempos, plist[i][0], 
            pricedata[1], plist[i][9], plist[i][5], pricedata[3], plist[i][6], aktdate, user ];
            statements.push([ "OFFERITEM", cfields , ctypes, cvalues]);
            __insPos( plist[i][0] , newitemid, itempos );
        }              
    }  
    if ( statements.length > 0 )    a.sqlInsert(statements);
    sortItemPos( "OFFERITEM", "OFFER_ID = '" + offerid + "'" );
}

/*
* Neu Position anlegen.
*
*/
function NewOfferPosition( pNewPosition )
{
    var prompts = new Array();
    prompts["offercode"] = a.valueof("$comp.OFFERCODE");
    prompts["language"] = a.valueof("$comp.LANGUAGE");
    prompts["currency"] = a.valueof("$comp.CURRENCY");
    prompts["relorgid"] = a.valueof("$comp.relorgid");
    prompts["comp4refresh"] =  ["$comp.Table_Items", "$comp.NET"];
    prompts["autoclose"] =  true;
    prompts["ID"] = a.valueof("$comp.OFFERID");
    prompts["isedit"] = true;
    prompts["newposition"] = pNewPosition;

    a.openLinkedFrame("OFFERITEM", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);
}

/*
* gibt an ob markierte Zeilen verschoben werden kann
*
* @param {String} pItemComp req markierte Komponente, z.B."$comp.Table_Offeritem"
* @param {String} pTableName req Name der DBTabelle
* @param {String} pCondition req Condition
* @param {Integer} pCount opt Gibt an, um wieviele Positionen verschoben werden soll
* 
* @return {void}
*/

function canMoveItemPos( pItemComp, pTableName, pCondition, pCount )
{
    var markedItem = a.decodeFirst(a.valueof(pItemComp));
    var i;
    var markedofferitempos = a.sql("select ITEMPOSITION from " + pTableName + " where " + pTableName + "ID = '" + markedItem + "'");

    //Array mit einzelnen Stellen der Position des markierten Datensatzes
    var ArrayOfMarkedPosition = getDotsPerPosition(markedofferitempos);
    //Länge des Arrays - 1 (letzte Position im Array des markierten Datensatzes und Stelle der zu änderenden Zahl)
    var DotsOfMarkedPosition = ArrayOfMarkedPosition.length -1;
    if ( DotsOfMarkedPosition > 0 )  // Nur Positionen der Ebene
    {
        pCondition += " and ITEMPOSITION like '"
        for(i = 0; i < DotsOfMarkedPosition; i++)	pCondition += ArrayOfMarkedPosition[i] + "."
        pCondition += "%'";
    }
    var offeritems = a.sql("select " + pTableName + "ID, ITEMPOSITION from " + pTableName + " where " + pCondition, a.SQL_COMPLETE);
    // Anzahl der Elemente gleicher Ebene ermitteln
    var maxpos = 0;
    for(i = 0; i < offeritems.length; i++)	if( getDotsPerPosition(offeritems[i][1]).length == DotsOfMarkedPosition + 1 ) maxpos++;
    var newpos = eMath.addInt((ArrayOfMarkedPosition[DotsOfMarkedPosition]), pCount)
    return (  newpos > 0 && newpos <= maxpos )
}

/*
* verschiebt markierte Zeilen in einer TabellenComponente unter Berücksichtigung von Unterpunkten
*
* @param {String} pItemComp req markierte Komponente, z.B."$comp.Table_Offeritem"
* @param {String} pTableName req Name der DBTabelle
* @param {String} pCondition req Condition
* @param {Integer} pCount opt Gibt an, um wieviele Positionen verschoben werden soll
*
* @return {void}
*/

function moveItemPos( pItemComp, pTableName, pCondition, pCount )
{
    var i;
    var value;
    var shiftcount;
    if ( pCount == undefined )
        shiftcount = a.askQuestion(a.translate("Verschieben um Anzahl Positionen\n  ( + nach unten / - nach oben ) ?"), a.QUESTION_EDIT, "");
    else 	shiftcount = pCount;
    if (shiftcount != '')
    {
        var markedItem = a.decodeFirst(a.valueof(pItemComp));
        var markedofferitempos = a.sql("select ITEMPOSITION from " + pTableName + " where " + pTableName + "ID = '" + markedItem + "'");

        var columns = new Array("ITEMPOSITION", "DATE_EDIT", "USER_EDIT");
        var columntypes = a.getColumnTypes( pTableName, columns);

        var date = a.valueof("$sys.date");
        var user = a.valueof("$sys.user");

        //Array mit einzelnen Stellen der Position des markierten Datensatzes
        var ArrayOfMarkedPosition = getDotsPerPosition(markedofferitempos);
        //Länge des Arrays - 1 (letzte Position im Array des markierten Datensatzes und Stelle der zu änderenden Zahl)
        var DotsOfMarkedPosition = ArrayOfMarkedPosition.length -1;
        var condition = "";
        if ( DotsOfMarkedPosition > 0 )  // Nur Positionen der Ebene
        {
            condition += " and ITEMPOSITION like '"
            for(i = 0; i < DotsOfMarkedPosition; i++)	condition += ArrayOfMarkedPosition[i] + "."
            condition += "%'";
        }
        var offeritems = a.sql("select " + pTableName + "ID, ITEMPOSITION from " + pTableName + " where " + pCondition + condition, a.SQL_COMPLETE);
        // Anzahl der Elemente gleicher Ebene ermitteln
        var maxpos = 0;
        for(i = 0; i < offeritems.length; i++)	if( getDotsPerPosition(offeritems[i][1]).length == DotsOfMarkedPosition + 1 ) maxpos++;
        for(i = 0; i < offeritems.length; i++)
        {
            //Array der Stellen des Datensatzes
            var ArrayOfPosition = getDotsPerPosition(offeritems[i][1]);
            var newpos = eMath.addInt((ArrayOfMarkedPosition[DotsOfMarkedPosition]), shiftcount)
            if ( newpos < 1 || newpos > maxpos ) return;
			
            if(ArrayOfPosition[DotsOfMarkedPosition] == ArrayOfMarkedPosition[DotsOfMarkedPosition])
            {
                ArrayOfPosition[DotsOfMarkedPosition] = newpos;
                value = new Array(ArrayOfPosition.join("."), date, user);
                a.sqlUpdate(pTableName, columns, columntypes, value, pTableName + "ID = '" + offeritems[i][0] + "'")
            }
            else if(ArrayOfPosition[DotsOfMarkedPosition] == newpos )
            {
                ArrayOfPosition[DotsOfMarkedPosition] = ArrayOfMarkedPosition[DotsOfMarkedPosition];
                value = new Array(ArrayOfPosition.join("."), date, user);
                a.sqlUpdate(pTableName, columns, columntypes, value, pTableName + "ID = '" + offeritems[i][0] + "'")
            }
        }

        sortItemPos( pTableName, pCondition );
        a.refresh(pItemComp);
    }
}

/*
* sortiert Zeilen in der TabellenComponente
*
* @param {String} pTableName req Name der DBTabelle
* @param {String} pCondition req Condition
* 
* @return {void}
*/

function sortItemPos( pTableName, pCondition )
{
    var offeritems = a.sql("select " + pTableName + "ID, ITEMPOSITION from " + pTableName + " where " + pCondition, a.SQL_COMPLETE);
    var items = [];

    for(var i=0; i < offeritems.length; i++)
    {
        var itempos = getDotsPerPosition(offeritems[i][1])
        var sitem = [ offeritems[i][0], "0", "0", "0", "0", "0", "0"];
        for ( y = 0; y < itempos.length; y++ )	sitem[y+1] = itempos[y];
        items.push( sitem );
    }
    var columns = ["ITEMSORT"];
    var columntypes = a.getColumnTypes( pTableName, columns);		
    sortArray(items, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6 );
    for(i=0; i < items.length; i++)
    {
        var columnvalues = [ i + 1 ];
        a.sqlUpdate(pTableName, columns, columntypes, columnvalues, pTableName + "ID = '" + items[i][0] + "'")
    }
}

/*
* reorganisiert die Positionen
*
* @param {String} pTableName req Name der DBTabelle
* @param {String} pCondition req Condition
* 
* @return {void}
*/

function reorgItemPosition( pTableName, pCondition )
{
    var statements = [];
    var fields = ["ITEMPOSITION"];
    var types = a.getColumnTypes( pTableName, fields);
    
    var item = a.sql("select " + pTableName + "ID, ITEMPOSITION from " + pTableName + " where " + pCondition + " order by ITEMSORT", a.SQL_COMPLETE);

    __reorg( "", "" )

    function __reorg( pRoot, pNewRoot )
    {
        var maxpos = 1;
        for(var i = 0; i < item.length; i++)	
        {
            if( item[i][1].split(".").length == pRoot.split(".").length && item[i][1].substr( 0, pRoot.length) == pRoot )
            {               
                var newpos = pNewRoot + String(maxpos++);
                if( item[i][1] != newpos )    
                {    
                    statements.push([ pTableName, fields, types, [newpos], pTableName + "ID = '" + item[i][0] + "'"] )
                }
                __reorg( item[i][1] + ".", newpos + "." )
            }
        }
    }
    if (statements.length > 0)  a.sqlUpdate(statements);
}

/*
* Gibt eine neu Position zurück.
*
* @param {String} pItemID req OfferItemID
* @param {String} pTableName req Name der DBTabelle
* @param {String} pCondition req Condition
* 
* @return {String} Neu Positionsnummer
*/
function getNewPosition( pItemID, pTableName, pCondition)
{
    var itempos = "";
    if (pItemID != "" )
    {
        itempos = a.sql("select ITEMPOSITION from " + pTableName + " where " + pTableName + "ID = '" + pItemID + "'");
        itempos += "."
    }
    var PartsOfPosition = itempos.split(".").length;

    var offeritems = a.sql("select ITEMPOSITION from " + pTableName + " where " + pCondition + " and ITEMPOSITION like '" + itempos +"%'", a.SQL_COLUMN);
    var maxpos = 1;
    for(i = 0; i < offeritems.length; i++)	
    {
        if( offeritems[i].split(".").length == PartsOfPosition && offeritems[i].substr( 0, itempos.length) == itempos )  maxpos++;
    }
    return  String(itempos) + String(maxpos);
}

/*
* Überprüft, wie viel Punkte in der Position vorhanden sind.
* Liefert ein Array:
* Länge des Arrays:
* 1 = 0 Punkte
* 2 = 1 Punkte
* 3 = 2 Punkte
* 4 = 3 Punkte]
*
* @param {String} pMarkedPos req Markierte Position
*
* @return {Integer}
*/
function getDotsPerPosition(pMarkedPos)
{
    var markedPosArray = pMarkedPos.split(".");
    return markedPosArray;
}

/*

* löscht markierte Zeilen in einer TabellenComponente
* 
* @param {String} pCompTable req Name der Tabellencomponente
* @param {String} pTableName req Name der DBTabelle
* @param {String} pCondition req Condition der PositionsDatensätze
*
* @return {void}
*/
function deleteItemPos( pCompTable, pTableName, pCondition )
{
    var markedItem = a.decodeFirst(a.valueof(pCompTable));
    var markedofferitempos = a.sql("select itemposition from " + pTableName + " where " + pTableName + "ID = '" + markedItem + "'" );
    var offeritems = a.sql("select " + pTableName + "ID, itemposition from " + pTableName + " where " + pCondition, a.SQL_COMPLETE);

    //Array mit einzelnen Stellen der Position des markierten Datensatzes
    var ArrayOfMarkedPosition = getDotsPerPosition(markedofferitempos);
    //Länge des Arrays - 1 (letzte Position im Arraydes markierten Datensatzes und Stelle der zu änderenden Zahl)
    var DotsOfMarkedPosition = ArrayOfMarkedPosition.length -1;
    
    for(var i=0; i<offeritems.length;i++)
    {
        //Array der Stellen des Datensatzes
        var ArrayOfPosition = getDotsPerPosition(offeritems[i][1]);

        var todel = true;
        for (var y=0; y < ArrayOfMarkedPosition.length; y++ )  
            if ( ArrayOfPosition[y] != ArrayOfMarkedPosition[y]   ) todel = false;
        if ( todel) a.sqlDelete( pTableName, pTableName + "ID = '" + offeritems[i][0] + "'" );
    }
    sortItemPos( pTableName, pCondition );
    reorgItemPosition( pTableName, pCondition );
    a.refresh(pCompTable);
}

/*
* überprüft Gültigkeit der Preisliste
*
* @param {String} pProductID req ID 
* @param {String} pCurrency req Währung
*
* @return {[]}
*/
function pricevalidation(pProductID, pCurrency)
{
    var list = a.sql("select PRICE from PRODUCT join PRODUCTPRICE on PRODUCTID = PRODUCT_ID "
        + " where BUYSELL = 'VK' and PRODUCT_ID = '" + pProductID + "' and CURRENCY = '" + pCurrency + "' and " 
        + getTimeCondition("ENTRYDATE", "<",a.valueof("$sys.date"))
        + " order by ENTRYDATE desc", a.SQL_COMPLETE);
    return list;
}

/*
* berechnet Preisliste und Preis
*
* @param {String} pProductID req ID 
* @param {String} pCurrency req Währung
* @param {String} pPricelist req Preisliste als KEYVALUE
* @param {String} pQuantity req Anzahl
* 
* @return {[]}
*/
function getPrice( pProductID, pCurrency, pPricelist, pQuantity )
{
    var list = a.sql("select PRICELIST, PRICE, " + getKeySQL("Pricelist", "PRICELIST") + ", VAT"
        + " from PRODUCTPRICE where BUYSELL = 'VK' and PRODUCT_ID = '" + pProductID + "' and CURRENCY = '" 
        + pCurrency + "' and " + getTimeCondition("ENTRYDATE", "<",a.valueof("$sys.date")) + " and FROMQUANTITY <= " + pQuantity 
        + " order by ENTRYDATE desc, FROMQUANTITY desc", a.SQL_COMPLETE);
    for (i=0;i<list.length;i++)
    {
        if (list[i][0] == Number(pPricelist)) return list[i]
    }
    for (i=0;i<list.length;i++)
    {
        if (list[i][0] == 1) return list[i]
    }
    return [0, 0, "keine", 0]
}

/*
* berechnet AOType aus Textblock
*
* @param {String} pHeader req 
* @param {String} pOrdertype req 
*
* @return {INTEGER}
*/
function getAOType (pHeader, pOrdertype)
{
    if (pOrdertype == 1) var keyname = "AB_";
    else keyname = getKeyName( pOrdertype, "ORDERTYPE") + "_";
    keyname += pHeader;
    var aotype = a.sql("select KEYVALUE from KEYWORD where KEYTYPE = (select KEYVALUE from KEYWORD where KEYNAME2 = 'TextblockTyp') "
        + " and KEYNAME1 = '" + keyname + "'")
    return aotype
}

/*
* Gibt Liste der verknüpften Objekte zurück (SALESPROJECT, PROPERTY, OFFER, SALESORDER)
*
* @param {String} pID req Id 
* @param {Boolean} isSalesorder 
* 
* @return {[]}
*/
function getLinks(pID, isSalesorder)
{
    var info;
    var list = [];
    var sent;
    if ( pID != '' )
    {
        var modul = ["SALESPROJECT", "Vertriebsprojekt"];
        var sql = a.sql("select SALESPROJECTID, DATE_NEW, PROJECTNUMBER, " + getKeySQL("OPPSTATE", "STATE") 
            + ", VOLUME, " + getKeySQL("OPPPHASE", "PHASE") + ", PROJECTTITLE "
            + " from SALESPROJECT where SALESPROJECTID = '" + a.valueof("$comp.PROJECT_ID") + "'", a.SQL_ROW);
        if (sql.length > 0)
        {
            info = sql[6] + ", Volumen(T\€): " + a.formatDouble(eMath.roundInt(sql[4], eMath.ROUND_HALF_EVEN), "#,##0") + ", Phase: " + sql[5];
            list.push([a.encodeMS([sql[0], modul[0]]), modul[1], sql[1], sql[2], sql[3], info])
        }
   
        if ( isSalesorder )
        {
            modul = ["OFFER", "Angebot"];
            sql = a.sql("select OFFERID, OFFERDATE, OFFERCODE, VERSNR, STATUS, NET, CURRENCY, ADDRESS " //4 entfernt...
                + " from OFFER where OFFERID = '" + a.valueof("$comp.OFFER_ID") + "'", a.SQL_ROW);
            if (sql.length > 0)
            {
                var offercode = sql[2] + "-" + sql[3];
                if (sql[4] == 2) sent = "versendet"; else sent = "";
                info = "netto : " + a.formatDouble(eMath.roundInt(sql[5], eMath.ROUND_HALF_EVEN), "#,##0") 
                + " " + sql[6] + ", " + sql[7];
                list.push([a.encodeMS([sql[0], modul[0]]), modul[1], sql[1], offercode, sent, info]);
            }

            modul = ["SALESORDER", "Beleg"];
            sql = a.sql("select SALESORDERID, ORDERDATE, ORDERCODE, SENT, NET, CURRENCY, " + getKeySQL("ORDERTYPE", "ORDERTYPE")
                + " from SALESORDER where SALESORDER_ID = '" + a.valueof("$comp.idcolumn") 
                + "' or SALESORDERID = '" + a.valueof("$comp.SALESORDER_ID") + "'", a.SQL_COMPLETE);
            for (var j=0; j<sql.length; j++)
            {
                info = "netto : " + a.formatDouble(eMath.roundInt(sql[j][4], eMath.ROUND_HALF_EVEN), "#,##0") + " " + sql[j][5];
                if (sql[j][3] == 'Y') sent = "versendet"; else sent = "";
                list.push([a.encodeMS([sql[j][0], modul[0]]), sql[j][6], sql[j][1], sql[j][2], sent, info])
            }
        }
    }
    return(list)
}

/*
* Fügt Sückliste einer Position ein 
* 
* @param {String} pRelationID req. RelationID der Firma / Privatperson
* @param {String} pAddresstype req. Addresstyp 
*
* @return {String} Adresse
*/
function getOrderAddress( pRelationID, pAddresstype )
{ 
    var reltype = getRelationType(pRelationID);
    var addrrelid = "'" + pRelationID + "'";
    
    if ( reltype == 3 )   
    {    
        addrrelid = "(select max(RELATIONID) from RELATION where PERS_ID is NULL and ORG_ID = ( select ORG_ID from RELATION where RELATIONID =  '" + pRelationID + "'))";      
        reltype = 1;
    }
    var addrid = a.sql("select ADDRESSID from ADDRESS where ADDR_TYPE in (select KEYVALUE from KEYWORD where " + getKeyTypeSQL("AdressTyp") 
        + " and KEYNAME1 = '" + pAddresstype + "' and KEYNAME2 = '" + reltype + "') and RELATION_ID = " + addrrelid);
                            
    if(addrid == "") ret = new AddrObject( pRelationID ).getFormattedAddress();
    else ret = new AddrObject( pRelationID, addrid ).getFormattedAddress();
    return ret;
}