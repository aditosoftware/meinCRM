var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];

var discount = a.valueof("$comp.item_discount") == "" ? 0 : parseFloat( a.valueof("$comp.item_discount") ); 

var price = tabledata[7];
var quantity = tabledata[5];

if (quantity != '' && price != '')
{
    sum = eMath.roundDec(quantity * price * (100 - discount) / 100, 2, eMath.ROUND_HALF_EVEN);
    a.updateTableCell("$comp.Table_Items", tableid, 9, sum, a.formatDouble(sum, "#,##0.00"));
}
else
{
    a.updateTableCell("$comp.Table_Items", tableid, 8, "", "");
    a.updateTableCell("$comp.Table_Items", tableid, 9, "", "");
}