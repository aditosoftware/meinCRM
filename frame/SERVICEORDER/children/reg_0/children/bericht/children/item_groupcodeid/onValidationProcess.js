// Leeren der Spalten bei Änderung der Produktgruppe
var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];
if (tableid != '')
    for (i=3; i<tabledata.length-1; i++)
        a.updateTableCell("$comp.Table_Items", tableid, i, '', '');