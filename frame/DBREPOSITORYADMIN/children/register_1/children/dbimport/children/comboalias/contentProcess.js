import("lib_dbschema")

var repo = new RepositoryObject();
var res = new Array();
var liste = repo.getDatabaseAliases();

for(var i = 0; i < liste.length; i++)
{
    res.push( new Array(liste[i]) );
}

a.ro(res);