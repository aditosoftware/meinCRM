var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];

var price = a.valueof("$comp.item_price");
var quantity = tabledata[3]; 
var discount = tabledata[6]; 

if (quantity != "" && price != "" && discount != "")
{
    sum = eMath.roundDec(quantity * price * (100 - discount) / 100, 2, eMath.ROUND_HALF_EVEN);
    a.updateTableCell("$comp.Table_Items", tableid, 7 , sum, a.formatDouble(sum, "#,##0.00"));
}