import("lib_themetree")

var treeid = a.valueof("$comp.treeThemen");

if (treeid != "" )
{
    var id = a.addTableRow("$comp.tblThemen");
    a.updateTableCell("$comp.tblThemen", id, 1, treeid,  getThema(treeid));
    a.refresh("$comp.btnAddThema");
}