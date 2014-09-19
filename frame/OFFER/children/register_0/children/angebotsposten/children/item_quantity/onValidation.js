var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];

var quantity = a.valueof("$comp.item_quantity");
var price = tabledata[7]; 
var discount =  tabledata[8] == "" || tabledata[8] == null ? 0 : parseFloat( tabledata[8] ); 

if (quantity != "" && price != "")
{
    sum = eMath.roundDec(quantity * price * (100 - discount) / 100, 2, eMath.ROUND_HALF_EVEN);
    a.updateTableCell("$comp.Table_Items", tableid, 9, sum, a.formatDouble(sum, "#,##0.00"));
}
else
{
    a.updateTableCell("$comp.Table_Items", tableid, 7, "", "");
    a.updateTableCell("$comp.Table_Items", tableid, 8, "", "");
    a.updateTableCell("$comp.Table_Items", tableid, 9, "", "");
}