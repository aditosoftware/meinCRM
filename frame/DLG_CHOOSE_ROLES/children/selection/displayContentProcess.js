import("lib_util");

var listroles = [];
var listusers = [];

var roles = tools.getAllRoles( [ "PROJECT" ] );
for ( id in roles ) listroles.push ( [ id, roles[id][0], "Rolle" ] );
array_mDimSort(listroles, 1, true );

var users = tools.getStoredUsers();
for ( i=0; i < users.length; i++ )
{
    if ( !tools.hasRole(users[i][1], "PROJECT_Ressource") &&
          tools.getUser(users[i][1])[tools.PARAMS][tools.IS_ENABLED] == "true")
    {
        listusers.push ( [ users[i][1], users[i][1], "User" ] );
    }
}
array_mDimSort(listusers, 1, true );

a.ro( listroles.concat(listusers) );

