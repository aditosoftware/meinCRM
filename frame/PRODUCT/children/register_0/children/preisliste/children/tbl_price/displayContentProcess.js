import("lib_keyword");

var list = [];
var id = a.valueof("$comp.PRODUCTID")
if ( id != "" )	
{ 
    list = a.sql("SELECT PRODUCTPRICEID, ENTRYDATE, BUYSELL, " + getKeySQL( "Pricelist", "PRICELIST" )
        + ", FROMQUANTITY, PRICE, VAT, CURRENCY from PRODUCTPRICE "
        + " WHERE PRODUCT_ID = '" + id + "' order by ENTRYDATE desc", a.SQL_COMPLETE);
}
if (list == '') list = a.createEmptyTable(6)
a.ro(list);