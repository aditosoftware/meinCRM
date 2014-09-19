import("lib_sql")

var pid = a.valueof("$comp.PRODUCTID");

if (pid != '')
{
    var actualprice = a.sql("select price from productprice where buysell = 'EK' and product_id = '" 
        + pid + "' and currency = 'EUR' order by entrydate desc", a.SQL_COLUMN)[0];
    if (actualprice != undefined)
        a.rs(Number(actualprice))
    else
        a.rs(0)
}