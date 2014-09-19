var cname = "$comp.tbl_ADDRESS";
var id = a.decodeFirst(a.valueof(cname)).substr(0, 36);
a.setValue("$comp.ADDRESS_ID", id)
var data = a.getTableData(cname, a.ALL);

for ( var i = 0; i < data.length; i++ )
{
    a.updateTableCell(cname, data[i][0], 2, "-1", "-1" );
}
a.updateTableCell(cname, id, 2, "-51", "-51" );