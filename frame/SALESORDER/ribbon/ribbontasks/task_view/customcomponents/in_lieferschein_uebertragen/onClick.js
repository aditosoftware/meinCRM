var id = a.valueof("$comp.SALESORDERID");

//Beleg kopieren
var head = a.sql("select CURRENCY, LANGUAGE, PAYMENTTERMS, REMARK, RELATION_ID, SALESORDERID, PROJECT_ID, PROPERTY_ID, OFFER_ID, ADDRESS_INVOICE, ADDRESS_DELIVERY "
    + " FROM SALESORDER WHERE SALESORDERID = '" + id + "'", a.SQL_ROW);
// Posten kopieren
var ids = a.decodeMS(a.valueof("$comp.Table_Items"));
if (ids.length > 0) ids = " and ORDERITEMID in ('" + ids.join("','") + "')"; 
else ids = "";
var item = a.sql("select ORDERITEM.GROUPCODEID, PRODUCTID, PRODUCTNAME, PRODUCTCODE, ORDERITEM.UNIT, PRICE, QUANTITY, "
    + " DISCOUNT, QUANTITY * PRICE * (100 - DISCOUNT) / 100, VAT, ORDERITEM.DESCRIPTION, ITEMNAME"
    + " from ORDERITEM join PRODUCT on (PRODUCTID = ORDERITEM.PRODUCT_ID)"
    + " where SALESORDER_ID = '" + id + "' " + ids + " order by ITEMSORT", a.SQL_COMPLETE);

var prompts = new Array();
var defaultvalue = new Array();
defaultvalue["$comp.CURRENCY"] = head[0];
defaultvalue["$comp.LANGUAGE"] = head[1];
defaultvalue["$comp.PAYMENTTERMS"] = head[2];
defaultvalue["$comp.REMARK"] = head[3];
defaultvalue["$comp.RELATION_ID"] = head[4];
defaultvalue["$comp.SALESORDER_ID"] = head[5];
defaultvalue["$comp.PROJECT_ID"] = head[6];
defaultvalue["$comp.OFFER_ID"] = head[8];
defaultvalue["$comp.ADDRESS_INVOICE"] = head[9];
defaultvalue["$comp.ADDRESS_DELIVERY"] = head[10];
defaultvalue["$comp.ORDERTYPE"] = "5";
prompts["DefaultValues"] = defaultvalue;
prompts["positions"] = item;
prompts["autoclose"] =  false;

a.openLinkedFrame("SALESORDER", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);