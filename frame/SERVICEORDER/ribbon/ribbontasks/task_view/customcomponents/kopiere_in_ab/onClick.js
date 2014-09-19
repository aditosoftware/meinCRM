var id = a.valueof("$comp.idcolumn");

//Beleg kopieren
var head = a.sql("select SERVICEORDER.REPORT, RELATION_ID FROM SERVICEORDER WHERE SERVICEORDERID = '" + id + "'", a.SQL_ROW);
// Posten kopieren
var ids = a.decodeMS(a.valueof("$comp.Table_Items"));
if (ids.length > 0) ids = " and SERVICEITEMID in ('" + ids.join("','") + "')"; 
else ids = "";
var item = a.sql("select SERVICEITEM.GROUPCODEID, PRODUCTID, PRODUCTNAME, PRODUCTCODE, PRODUCT.UNIT, PRICE, QUANTITY, "
    + " DISCOUNT, QUANTITY * PRICE * (100 - DISCOUNT) / 100, VAT, ITEMSORT, SERVICEITEM.DESCRIPTION "
    + " from SERVICEITEM join PRODUCT on (PRODUCTID = SERVICEITEM.PRODUCT_ID)"
    + " where ASSIGNEDTO is null and SERVICEORDER_ID = '" + id + "' " + ids + " order by ITEMSORT", a.SQL_COMPLETE);

var prompts = new Array();
var defaultvalue = new Array();
defaultvalue["$comp.CURRENCY"] = "EUR";
defaultvalue["$comp.LANGUAGE"] = "1"; //Deutsch
defaultvalue["$comp.PAYMENTTERMS"] = "1";
defaultvalue["$comp.REMARK"] = head[0];
defaultvalue["$comp.RELATION_ID"] = head[1];
defaultvalue["$comp.PROJECT_ID"] = "";
defaultvalue["$comp.ORDERTYPE"] = "1";
prompts["DefaultValues"] = defaultvalue;
prompts["positions"] = item;
prompts["autoclose"] =  false;

a.openLinkedFrame("SALESORDER", null, false, a.FRAMEMODE_NEW, "", null, false, prompts);