var tableid = a.decodeFirst(a.valueof("$comp.tbl_participants"));
var tabledata = a.getTableData("$comp.tbl_participants", [tableid])[0];

var charge = a.valueof("$comp.CHARGE");
var discountpart = a.valueof("$comp.Edit_discount");
var chargepart = tabledata[6];

if ( charge != '' && chargepart != '' && discountpart != '')
{
    chargepart = charge * (100 - discountpart) / 100;
    a.updateTableCell("$comp.tbl_participants", tableid, 6, chargepart, a.formatDouble(chargepart, "#,##0.00"));
}