import("lib_util");

var listroles = [];
var listusers = [];

var roles = tools.getAllRoles( [ "PROJECT" ] );
for ( id in roles ) listroles.push ( [ id, roles[id][0] + " (Rolle)" ] );
array_mDimSort(listroles, 1, true );

var user = tools.getStoredUsers();
for ( i=0; i < user.length; i++ ) listusers.push ( [ user[i][1], user[i][1] + " (User)" ] );
array_mDimSort(listusers, 1, true );

a.ro( listroles.concat(listusers) );