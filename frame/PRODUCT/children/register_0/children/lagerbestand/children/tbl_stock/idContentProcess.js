var id = a.valueof("$comp.PRODUCTID")
var sqlstr = a.EMPTY_TABLE_SQL;

if ( id != "" )
{ 
    sqlstr = "SELECT STOCKID, ENTRYDATE, '', QUANTITY, REFNUMBER "
        + " from STOCK WHERE PRODUCT_ID = '" + id + "' order by ENTRYDATE desc";
}
a.rq( sqlstr );