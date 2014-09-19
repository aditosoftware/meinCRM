import("lib_keyword");
import("lib_offerorder");
var ids = a.decodeMS(a.valueof("$comp.tbl_participants"));

//Daten für Kopfbereich
var head = a.sql("select ORGREL.RELATIONID, RELATION.RELATIONID, CHARGEPART, DISCOUNTPART, ORGREL.LANG, LASTNAME, FIRSTNAME, SALUTATION, EVENT.TITLE, EVENT.EVENTSTART, EVENT.EVENTEND, EVENT.CATEGORY, EVENT.CHARGE, EVENTID "
    + " from EVENTPARTICIPANT "
    + " join EVENT on EVENTID = EVENTPARTICIPANT.EVENT_ID "
    + " join RELATION on EVENTPARTICIPANT.RELATION_ID = RELATIONID "
    + " join RELATION ORGREL on ORGREL.ORG_ID = RELATION.ORG_ID and ORGREL.PERS_ID is null "
    + " join PERS on PERSID = RELATION.PERS_ID "
    + " where EVENTPARTICIPANTID in ('" + ids.join("','") + " ') order by ORGREL.RELATIONID", a.SQL_COMPLETE);

//Rechnungs-Positionen
var product = a.sql("select GROUPCODEID, PRODUCTID, PRODUCTNAME, PRODUCTCODE, UNIT"
    + " from PRODUCT"
    + " where PRODUCTID = '6d697751-e639-4fb3-aa34-b79cb6284db7' ", a.SQL_ROW);

var maxcode =  eMath.addInt(a.sql("select max(ordercode) from salesorder"), 1);

var mwst = getPrice( product[1], "EUR", "", 1 )[3];

var headold = head[0];
var position = []; 
for(var i = 0; i < head.length; i++)
{   
   //Wenn Firma ungleich vorhergehende Firma, dann Datensatz schreiben
   if (headold[0] != head[i][0] )  
    {   
        makeorder(headold, position, maxcode );
        headold = head[i];
        position = [];    
        maxcode = eMath.addInt(maxcode, 1)
    }
    position.push([product[0], product[1], head[i][8], product[3], product[4], head[i][12], 1, head[i][3], head[i][2], mwst, 
                     "\nTeilnehmer: " + head[i][7] + " " + head[i][6] + " " + head[i][5] , "", ""]);
}    
makeorder(headold, position, maxcode);

function makeorder( pHead, pPos, pMaxcode )
{
    var prompts = new Array();
    var defaultvalue = new Array();
    defaultvalue["$comp.RELATION_ID"] = pHead[0];
    defaultvalue["$comp.CURRENCY"] = "EUR";
    defaultvalue["$comp.LANGUAGE"] = pHead[4];
    defaultvalue["$comp.ORDERCODE"] = pMaxcode;
    defaultvalue["$comp.ORDERTYPE"] = "2";
    defaultvalue["$comp.HEADER"] = "Rechnung über Kurs:\n" + pHead[8] + ": " + getKeyName(pHead[11], "EVENTCATEGORY") + "\nvom " + date.longToDate(pHead[9], "dd.MM.yyyy") 
                        + " bis " + date.longToDate(pHead[10], "dd.MM.yyyy");
    prompts["DefaultValues"] = defaultvalue;
    prompts["positions"] = pPos;
    prompts["autoclose"] =  false;
    
    a.openLinkedFrame("SALESORDER", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);
    
}
