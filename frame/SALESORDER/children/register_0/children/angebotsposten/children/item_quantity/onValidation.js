import("lib_offerorder");
import("lib_keyword");

var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];
if (tableid != '')
{
    var relorgid = a.valueof("$comp.relorgid");
    var pricelist = GetAttributeKey( "Preisliste", 1, relorgid )[0];
    if ( pricelist == undefined) pricelist = 1;// Standardpreisliste
    var quantity = a.valueof("$comp.item_quantity");
    var productid = tabledata[2]; 
    var currency = a.valueof("$comp.CURRENCY");
    if (quantity == "") quantity = 1;
    var discount = tabledata[6]; 
    if ( productid != "" && currency != "" && quantity != "")
    {
        var list = getPrice( productid, currency, pricelist, quantity);
        var sum = eMath.roundDec(quantity * list[1] * (100 - discount) / 100, 2, eMath.ROUND_HALF_EVEN);

        a.updateTableCell("$comp.Table_Items", tableid, 5 , list[1], a.formatDouble(list[1], "#,##0.00"));
        a.updateTableCell("$comp.Table_Items", tableid, 7 , sum, a.formatDouble(sum, "#,##0.00"));
    }
}