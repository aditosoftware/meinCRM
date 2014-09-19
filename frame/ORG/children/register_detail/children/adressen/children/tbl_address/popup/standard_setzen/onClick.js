var cname = "$comp.tbl_ADDRESS";
var id = a.decodeFirst(a.valueof(cname));
var data = a.getTableData(cname, a.ALL);

// Informationen für die Verwendung von $image.standardadresse im afterSave-Prozess
a.imagevar("$image.standardadresse", a.valueof("$comp.ADDRESS_ID"));

a.setValue("$comp.ADDRESS_ID", id);

for ( var i = 0; i < data.length; i++ )		
{
    a.updateTableCell(cname, data[i][0], 1, "-1", "-1" );
}
a.updateTableCell(cname, id, 1, "-51", "-51" );