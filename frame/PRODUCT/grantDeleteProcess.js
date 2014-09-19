var id = a.valueof("$comp.PRODUCTID");
var countofferitem = a.sql("select count(PRODUCT_ID) from OFFERITEM where PRODUCT_ID = '" + id + "'");

a.rs(countofferitem == 0);