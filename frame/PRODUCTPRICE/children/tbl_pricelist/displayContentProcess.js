import("lib_keyword");
import("lib_sql")

var filtervalues = ["","","","","","",""];
if ( a.hasvar("$image.FilterValues") )	filtervalues = a.valueofObj("$image.FilterValues");

var groupcode = filtervalues[0];
var pricelist = filtervalues[1];
var validfrom = filtervalues[2];
var validuntil = filtervalues[3];
var fromquantity = filtervalues[4];
var toquantity = filtervalues[5];
var currency = filtervalues[6];
a.imagevar("$image.FilterValues", filtervalues );

var condition = "BUYSELL = 'VK'";
if (groupcode != "" && groupcode != undefined) condition += "and PRODUCT.GROUPCODEID = " + groupcode;
if (pricelist != "" && pricelist != undefined) condition += "and PRICELIST = " + pricelist;
if (validfrom != "" && validfrom != undefined) condition += "and " + getTimeCondition("ENTRYDATE", ">=", validfrom);
if (validuntil != "" && validuntil != undefined) condition += "and " + getTimeCondition("ENTRYDATE", "<=", validuntil);
if (fromquantity != "" && fromquantity != undefined) condition += "and FROMQUANTITY >= " + fromquantity;
if (toquantity != "" && toquantity != undefined) condition += "and FROMQUANTITY <= " + toquantity;
if (currency != "" && currency != undefined) condition += "and CURRENCY = '" + currency + "'";
a.imagevar("$image.condition", condition)
var list = a.sql("select PRODUCTPRICEID, PRODUCT.GROUPCODEID, PRODUCTCODE, PRODUCTNAME, PRICELIST, ENTRYDATE, FROMQUANTITY, PRICE, CURRENCY, VAT "
    + " from PRODUCTPRICE join PRODUCT on PRODUCT.PRODUCTID = PRODUCTPRICE.PRODUCT_ID "
    + " where " + condition + " order by ENTRYDATE desc, PRODUCT.GROUPCODEID, PRODUCTNAME", a.SQL_COMPLETE);

for (i=0;i<list.length; i++)
{
    list[i][1] = getKeyName(list[i][1], "GroupCode");
    list[i][4] = getKeyName(list[i][4], "Pricelist");
}

a.ro(list);