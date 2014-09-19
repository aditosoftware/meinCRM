import("lib_dbschema")

var sel = a.decodeMS(a.valueof("$comp.tblDiff"));
var aliasname = a.valueof("$comp.comboAlias_0");
var txt = "";

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
			var aliasmodel = a.getAliasModel(aliasname);
			tblobj.databasetype = aliasmodel[a.ALIAS_PROPERTIES]["databasetype"];
			
			var colobj = tblobj.getColumnWithName(col);
			
			if(colobj == undefined)   // nicht im repository enthalten
			{
				txt += "-- table " + tbl + ": column "  + col + " does not exist in repository\n\n";
			}
			else   // im repository enthalten
			{
				if(colobj.existsInDatabase(aliasname))
				{
					txt += "-- table " + tbl + ": column " + col + ": definition does not match database\n";
					txt += "-- alter table " + tbl + " alter column " + colobj.getDeclaration() + "\n\n";
				}
				else
				{
					txt += "-- alter table " + tbl + " add "  +  colobj.getDeclaration() + "\n\n";
				}
			}
			
		}
	}

	a.doClientIntermediate(a.CLIENTCMD_TOCLIPBOARD, [ txt ]);

}