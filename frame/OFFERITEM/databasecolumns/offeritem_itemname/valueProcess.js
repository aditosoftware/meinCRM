var productid = a.valueof("$comp.PRODUCT_ID");
var offerid = a.valueof("$comp.OFFER_ID");
var language = a.valueof("$comp.edt_language");
var text = "";

if(a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW && productid != '' && offerid != '' && language != '')
{
    text = a.sql("select SHORTTEXT from TEXTBLOCK where AOTYPE = 1 and TABLENAME = 'PRODUCT' and ROW_ID = '" 
        + productid + "' and LANG = " + language);
    if ( text == "")  text = a.sql("SELECT PRODUCTNAME FROM PRODUCT WHERE PRODUCTID = '" + productid + "'");
    a.rs(text);
}
