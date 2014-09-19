var id = a.decodeFirst(a.valueof("$comp.tbl_pricelist"))
if ( id != "" )
{
    id = a.sql("select PRODUCT_ID from PRODUCTPRICE where PRODUCTPRICEID = '" + id + "'");
    a.openFrame("PRODUCT", "PRODUCTID = '" + id + "'", false, a.FRAMEMODE_SHOW);
}