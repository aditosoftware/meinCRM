var offerid = a.valueof("$comp.OFFERID");
var list = a.createEmptyTable(9);

if ( offerid != "") 
{
    list = a.sql("select OFFERITEMID, 'true', ASSIGNEDTO, ITEMPOSITION, ITEMNAME, "
        + " QUANTITY, OFFERITEM.UNIT, PRICE, DISCOUNT, QUANTITY * PRICE * (100 - DISCOUNT) / 100, VAT, optional, description "
        + " from OFFERITEM join PRODUCT on (productid = offeritem.product_id) "
        + " where OFFER_ID = '" + offerid + "' order by ITEMSORT", a.SQL_COMPLETE);
}
a.ro(list);