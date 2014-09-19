var tableid = a.decodeFirst(a.valueof("$comp.tbl_participants"));
var tabledata = a.getTableData("$comp.tbl_participants", [tableid])[0];

var charge = a.valueof("$comp.CHARGE");
var discountpart = tabledata[5];
var chargepart = a.valueof("$comp.Edit_charge");

if ( charge != '' && chargepart != '' && discountpart != '')
{
    discountpart = (1 - chargepart / charge) * 100;
    a.updateTableCell("$comp.tbl_participants", tableid, 5, discountpart, a.formatDouble(discountpart, "#,##0.00"));
}