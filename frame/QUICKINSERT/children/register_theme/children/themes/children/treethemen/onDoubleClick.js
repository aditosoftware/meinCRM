import("lib_themetree")

var treeid = a.valueof("$comp.treeThemen");
if (treeid != "" )
{
        var data = a.getTableData("$comp.tblThemen", a.ALL);
        var enthalten = false;
        for(var i = 0; i < data.length; i++)
        {
            if(data[i][1] == treeid)
            {
                a.showMessage("Dieses Thema ist bereits zugewiesen");
                enthalten = true;
                break;
            }
        }
        if(!enthalten)
        {
            var id = a.addTableRow("$comp.tblThemen");
            a.updateTableCell("$comp.tblThemen", id, 1, treeid,  getThema(treeid));
            a.refresh("$comp.btnAddThema");
        }
}