import("lib_offerorder");
import("lib_keyword");

var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];
if (tableid != '')
{
    var relorgid = a.valueof("$comp.RELATION_ID");
    var pricelist = 1; // Standardpreisliste
    var quantity = a.valueof("$comp.item_quantity");
    var productid = tabledata[3]; 
    var currency = "EUR"; // nur gültig für Eurozone
    if (quantity == "") quantity = 1;
    var discount = tabledata[8]; 
    if ( productid != "" && currency != "" && quantity != "")
    {
        var list = getPrice( productid, currency, pricelist, quantity);
        var sum = quantity * list[1] * (100 - discount) / 100;

        a.updateTableCell("$comp.Table_Items", tableid, 7 , list[1], a.formatDouble(list[1], "#,##0.00"));
        a.updateTableCell("$comp.Table_Items", tableid, 9 , sum, a.formatDouble(sum, "#,##0.00"));
    }
}