import("lib_util");

var list = new Array();
var roles = tools.getAllRoles(["PROJECT", "INTERNAL"]);
for ( var role in roles )	list.push([ role, roles[role][0] ] );
array_mDimSort(list, 1, true)
a.returnobject( list );