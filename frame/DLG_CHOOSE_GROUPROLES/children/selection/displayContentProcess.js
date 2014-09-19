var list = new Array();
var roles = tools.getAllRoles(["PROJECT"]);
for ( var id in roles ) list.push([ id, roles[id][0] ] );
a.ro( list )