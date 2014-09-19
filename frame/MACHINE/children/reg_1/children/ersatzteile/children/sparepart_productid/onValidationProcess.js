var tableid = a.decodeFirst(a.valueof("$comp.tbl_spareparts"));
var tabledata = a.getTableData("$comp.tbl_spareparts", [tableid])[0];
if (tableid != '')
{
    var productid = a.valueof("$comp.sparepart_productid");
    var prod = a.sql("select PRODUCTCODE from PRODUCT where PRODUCTID = '" + productid + "'");
    var stock = a.sql("select sum(QUANTITY * IN_OUT) from STOCK where PRODUCT_ID = '" + productid + "'");
    if ( productid != "" && stock != "")
    {
        a.updateTableCell("$comp.tbl_spareparts", tableid, 2 , prod, prod);
        a.updateTableCell("$comp.tbl_spareparts", tableid, 3 , stock, stock);
    }
}