var ids =  a.valueofObj("$local.idvalue")

var list = a.sql("select PRODUCTPRICEID, PRODUCT.GROUPCODEID, PRODUCTCODE, PRODUCTNAME, PRICELIST, ENTRYDATE, FROMQUANTITY, PRICE, CURRENCY, VAT "
    + " from PRODUCTPRICE join PRODUCT on PRODUCT.PRODUCTID = PRODUCTPRICE.PRODUCT_ID "
    + " where PRODUCTPRICEID in ('" + ids.join("','") + "')", a.SQL_COMPLETE);

a.ro(list);