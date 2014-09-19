import("lib_storedSearches")

var user = a.valueof("$sys.user");
var list = [];
var searchlist = getStoredSelections(user);

for ( var i = 0; i < searchlist.length; i++ )
{
    var framename = a.decodeFirst(searchlist[i][0]);
    if ( framename == "ORG" || framename == "PERS" )
    {  
        list.push([ searchlist[i][0], a.translate(searchlist[i][1]) + " - " + searchlist[i][2] ]);
    }
}
a.returnobject(list);