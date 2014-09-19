import("lib_storedSearches");

if(a.valueof("$sys.workingmodebeforesave") != a.FRAMEMODE_NEW)
{
    var selectionlist = a.createEmptyTable(2);
    var user = a.valueof("$comp.login");
    if ( user != "")	selectionlist =	getStoredSelections(user);
    a.returnobject( selectionlist );
}