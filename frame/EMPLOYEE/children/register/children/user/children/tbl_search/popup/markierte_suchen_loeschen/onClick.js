import("lib_storedSearches");

var user = a.valueof("$comp.login");
var searchlist = a.decodeMS(a.valueof("$comp.tbl_search"));

for ( var i = 0; i < searchlist.length; i++ )
{
	var search = a.decodeMS(searchlist[i]);
	clearStoredSearches(user, search[0], search[1]);
}
a.refresh("$comp.tbl_search");