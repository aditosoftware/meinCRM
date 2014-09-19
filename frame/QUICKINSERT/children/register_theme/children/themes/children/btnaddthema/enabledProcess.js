var treeid = a.valueof("$comp.treeThemen");
var data = a.getTableData("$comp.tblThemen", a.ALL);
var enthalten = false;
for(var i = 0; i < data.length; i++)
{
    if(data[i][1] == treeid)
    {
        enthalten = true;
        break;
    }
}

a.rs((a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW || a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT) && a.valueof("$comp.treeThemen") != "" && !enthalten);