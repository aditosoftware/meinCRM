var allroles = tools.getAllRoles(["PROJECT"]);
var roles = a.decodeMS(a.valueofObj("$comp.list_roles"));
var list = [];
for (i=0; i<roles.length; i++)
    list.push( [ roles[i], allroles[roles[i]][0] ]);
a.ro(list);