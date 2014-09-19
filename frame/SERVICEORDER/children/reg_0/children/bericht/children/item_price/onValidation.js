var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];

var price = a.valueof("$comp.item_price");
var quantity = tabledata[5]; 
var discount = tabledata[8]; 

if (quantity != '' && price != '' && discount != '')
{
    sum = quantity * price * (100 - discount) / 100;
    a.updateTableCell("$comp.Table_Items", tableid, 9 , sum, a.formatDouble(sum, "#,##0.00"));
}