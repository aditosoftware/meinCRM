var tableid = a.decodeFirst(a.valueof("$comp.tblColumns"));
if (tableid != '')
{
    var tabledata = a.getTableData("$comp.tblColumns", [tableid])[0];
    if ( 
        tabledata[5] == 'integer' ||
        tabledata[5] == 'datetime' ||
        tabledata[5] == 'keyword' ||
        tabledata[5] == 'text' ||
        tabledata[5] == 'image'
            )
        a.updateTableCell("$comp.tblColumns", tableid, 7 , "", "");
}