var pid = a.valueof("$comp.PRODUCTID");

if (pid != '')
{
    var sum = a.sql("select sum(QUANTITY * IN_OUT) from STOCK where PRODUCT_ID = '" + pid + "'");
    if (sum == '')
        sum = 0
    a.rs(sum);
}