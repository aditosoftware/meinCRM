var id = a.valueof("$comp.OFFERID");

//Beleg kopieren
var head = a.sql("select CURRENCY, LANGUAGE, PAYMENTTERMS, REMARK, RELATION_ID, PROJECT_ID, PROPERTY_ID, ADDRESS, NET, "
    + " DELIVERYTERMS, VAT FROM OFFER WHERE OFFERID = '" + id + "'", a.SQL_ROW);
// Posten kopieren
var ids = a.decodeMS(a.valueof("$comp.Table_Items"));
if (ids.length > 0) ids = " and OFFERITEMID in ('" + ids.join("','") + "')"; 
else ids = "";
var item = a.sql("select OFFERITEM.GROUPCODEID, PRODUCTID, ITEMNAME, PRODUCTCODE, OFFERITEM.UNIT, PRICE, QUANTITY, "
    + " DISCOUNT, QUANTITY * PRICE * (100 - DISCOUNT) / 100, VAT, OFFERITEM.DESCRIPTION "
    + " from OFFERITEM join PRODUCT on (PRODUCTID = OFFERITEM.PRODUCT_ID)"
    + " where ASSIGNEDTO is null and OFFER_ID = '" + id + "' " + ids + " order by ITEMPOSITION", a.SQL_COMPLETE);

var prompts = new Array();
var defaultvalue = new Array();
defaultvalue["$comp.CURRENCY"] = head[0];
defaultvalue["$comp.LANGUAGE"] = head[1];
defaultvalue["$comp.PAYMENTTERMS"] = head[2];
defaultvalue["$comp.REMARK"] = head[3];
defaultvalue["$comp.RELATION_ID"] = head[4];
defaultvalue["$comp.PROJECT_ID"] = head[5];
defaultvalue["$comp.OFFER_ID"] = id;
defaultvalue["$comp.ADDRESS_INVOICE"] = head[7];
defaultvalue["$comp.NET"] = head[8];
defaultvalue["$comp.DELIVERYTERMS"] = head[9];
defaultvalue["$comp.ORDERTYPE"] = "1";
var vatsum = Number(a.sql("select sum(QUANTITY * PRICE * OPTIONAL * (100 - OFFERITEM.DISCOUNT) * VAT) / 10000 from OFFERITEM where OFFER_ID = '" + id + "'"));
defaultvalue["$comp.SUMME_UMST"] = eMath.roundDec(vatsum , 2, eMath.ROUND_HALF_UP);
prompts["DefaultValues"] = defaultvalue;
prompts["positions"] = item;
prompts["autoclose"] =  false;

a.openLinkedFrame("SALESORDER", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);