import("lib_keyword");
import("lib_sql");

var offerid = a.valueof("$comp.OFFERID");
var list = a.createEmptyTable(10);
var lang = getKeyName(a.valueof("$comp.LANGUAGE"), "SPRACHE", "keyname2");
if ( offerid != "") 
{
    list = a.sql("select OFFERITEMID, 'true', ASSIGNEDTO, ITEMPOSITION, " 
        + concat(["PRODUCTCODE","'/'", "ITEMNAME"]) + ", QUANTITY, " 
        + getKeySQL("Einheiten", "OFFERITEM.UNIT", lang) + ", PRICE, DISCOUNT, '', VAT, OPTIONAL, DESCRIPTION "
        + " from OFFERITEM join PRODUCT on PRODUCTID = OFFERITEM.PRODUCT_ID "
        + " where OFFER_ID = '" + offerid + "' order by ITEMSORT", a.SQL_COMPLETE);
    for(i = 0; i < list.length; i++)
    {
        if (list[i][2] == "")	
        {                
            var quantity = list[i][5] == "" ? 0 : parseFloat( list[i][5] );
            var price = list[i][7] == "" ? 0 : parseFloat( list[i][7] );
            var pdiscount = list[i][8] == "" ? 0 : parseFloat( list[i][8] );
                        
            // optional nicht summieren
            if ( list[i][9] != '1' )   list[i][9] = eMath.roundDec(price * quantity * (100 - pdiscount) / 100, 2, eMath.ROUND_HALF_EVEN);
            list[i][2] = -16777216;
        }
        else 
        {
            list[i][1] = 'false';
            list[i][2] = -3355444;
        }
    }
}
a.ro(list);