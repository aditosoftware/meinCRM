var id = a.valueof("$comp.MACHINE_ID");

if (id != '')
    a.rq("select PROD2PRODID, PRODUCTNAME, PRODUCTCODE, (select sum(QUANTITY * IN_OUT) from STOCK where PRODUCT_ID = PRODUCT.PRODUCTID)"
        + " from PRODUCT join PROD2PROD on PRODUCTID = SOURCE_ID where DEST_ID = (select PRODUCT_ID from MACHINE where MACHINEID = '" + id + "')");