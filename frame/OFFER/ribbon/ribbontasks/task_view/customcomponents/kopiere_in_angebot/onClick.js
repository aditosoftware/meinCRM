import("lib_offerorder");

// zur Info: Kopie erstellen wie bei Beleg mit Prompts nicht möglich da in OFFERITEM kein Insert vorgesehen (eigener Frame)
var statements = [];
var prompts = new Array();
prompts["offervers"] = true;

var id = a.valueof("$comp.OFFERID");
var offernr = a.valueof("$comp.OFFERCODE");
if ( a.askQuestion("neue Angebots-Nummer ?", a.QUESTION_YESNO, "") == "false" )
{
    // Versionsnummer generieren
    var versnr = a.sql("select max(VERSNR) from OFFER where OFFERCODE = " + offernr);
    if (versnr == '')  versnr = "1";
    versnr = eMath.addInt(versnr, "1");
}
else
{
    // Angebotsnummer generieren
    var maxcode = a.sql("select max(OFFERCODE) from OFFER");
    if (maxcode == '')  maxcode = "1000";
    offernr = eMath.addInt(maxcode, "1");
    versnr = "1";
}

// Angebot kopieren
var head = a.sql("select CURRENCY, DELIVERYTERMS, FOOTER, FOOTER_SHORT, HEADER, HEADER_SHORT, "
    + " LANGUAGE, NET, PAYMENTTERMS, PROJECT_ID, PROPERTY_ID, RELATION_ID, REMARK, VAT, ADDRESS, DISCOUNT "
    + " FROM OFFER WHERE OFFERID = '" + id + "'", a.SQL_ROW);
var nextID = a.getNewUUID();
var user = a.valueof("$sys.user");

var col = new Array("OFFERID", "CURRENCY", "DELIVERYTERMS", "FOOTER", "FOOTER_SHORT", "HEADER", "HEADER_SHORT",
    "LANGUAGE", "NET", "PAYMENTTERMS", "PROJECT_ID", "PROPERTY_ID", "RELATION_ID", "REMARK", 
    "VAT", "ADDRESS", "OFFERCODE", "VERSNR", "OFFERDATE", "DISCOUNT", "DATE_NEW", "USER_NEW");
var typ = a.getColumnTypes( "OFFER", col);
var val = [nextID, head[0], head[1], head[2], head[3], head[4], head[5], head[6], head[7], head[8], head[9], head[10], 
           head[11], head[12], head[13], head[14], offernr, versnr, date.date(), head[15], date.date(), user];
	
statements.push(["OFFER", col, typ, val]);

//Angebotsposten kopieren
var item = a.sql("select ASSIGNEDTO, DESCRIPTION, DISCOUNT, GROUPCODEID, ITEMNAME, ITEMPOSITION, OPTIONAL ,"
    + " PRICE, PRODUCT_ID, QUANTITY, UNIT, VAT, OFFERITEMID"
    + " from OFFERITEM where OFFER_ID = '" + id + "' order by ITEMPOSITION", a.SQL_COMPLETE);
										
col = new Array("OFFERITEMID", "OFFER_ID", "ASSIGNEDTO", "DESCRIPTION", "DISCOUNT", "GROUPCODEID", "ITEMNAME"
    , "ITEMPOSITION", "OPTIONAL", "PRICE", "PRODUCT_ID", "QUANTITY", "UNIT", "VAT", "DATE_NEW", "USER_NEW");
typ = a.getColumnTypes( "OFFERITEM", col);																			

//Alte IDs in Object speichern, um Spalte ASSIGNEDTO korrekt zu füllen
var newids = new Object();
for ( i = 0; i < item.length; i++)
{
    newids[item[i][12]] = a.getNewUUID();
}

for (i = 0; i< item.length; i++)
{	
    newid = newids[item[i][12]];
    if (item[i][0] != "") item[i][0] = newids[item[i][0]];
    val = [newid, nextID, item[i][0], item[i][1], item[i][2], item[i][3], item[i][4], item[i][5], item[i][6], item[i][7],
            item[i][8], item[i][9], item[i][10], item[i][11], date.date(), a.valueof("$sys.user")];
    statements.push(["OFFERITEM", col, typ, val]);
}
a.sqlInsert(statements);
sortItemPos( "OFFERITEM", "OFFER_ID = '" + nextID + "'")
a.openLinkedFrame("OFFER", "OFFERID = '" + nextID + "'", false, a.FRAMEMODE_EDIT, "", null, false, prompts);