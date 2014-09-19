import("lib_themetree")

var treeid = a.valueof("$comp.treeThemen");
var historyid = a.valueof("$comp.historyid");
var status = a.valueof("$sys.workingmode");

if (treeid != "" && historyid != "" && (status == a.FRAMEMODE_EDIT || status == a.FRAMEMODE_NEW))
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