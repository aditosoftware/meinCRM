import("lib_dbschema")

var sel = a.decodeMS(a.valueof("$comp.tblDiff"));
var aliasname = a.valueof("$comp.comboAlias_0");

if(sel.length > 0)
{
    var repo = new RepositoryObject();

    for(var i=0; i < sel.length; i++)
    {
        var tbl = sel[i].split(".")[0];
        var col = sel[i].split(".")[1];
		
        if((tbl != "") && (col != ""))
        {
            var tblobj = repo.tableFromRepositoryName(tbl);
            tblobj.transferColumnToRepository(aliasname, col);
            repo.writeToRepository(tblobj);
        }
    }

    a.imagevar("$image.difftable", compareRepoWithDatabase(a.valueof("$comp.comboAlias_0"), a.decodeMS(a.valueof("$comp.tblTablelist"))));
    a.refresh("$comp.tblDiff");
}