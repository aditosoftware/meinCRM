import("lib_dbschema")

var repo = new RepositoryObject();
var sel = a.decodeMS(a.valueof("$comp.tblTablelist"));
if (a.valueof("$comp.chk_allTables") == 'true')	sel = a.sql("select TABLEID from AOSYS_TABLEREPOSITORY", a.SQL_COLUMN);
var list = repo.getTables(sel);
var s = "";

for(var i=0; i < list.length; i++)
{
    var idx = repo.checkAutoIndex(list[i], false);
	
    if(idx != null && idx.length > 0)	
    {
        for(j = 0; j < idx.length; j++)	s += list[i] + "." + idx[j][1] + "\n";
    }
}

if(s != "")
{
    a.showMessage(a.translate("Für folgende Spalten sollte ein Index definiert sein:\n" + s));
}
else
{
    a.showMessage(a.translate("Alle Fremdschlüssel besitzen einen Index."));
}