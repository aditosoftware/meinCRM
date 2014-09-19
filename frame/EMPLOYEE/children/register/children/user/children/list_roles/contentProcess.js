import("lib_util");

var roles = tools.getAllRoles(["PROJECT"]);
var list = [];

for ( role in roles )
{
    if ( role != "PROJECT_Ressource" ) list.push( [ role, roles[role][0] ] );
}
sortArray(list, 1, 1 )
a.returnobject( list );