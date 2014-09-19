var role = a.valueof("$local.value").replace(new RegExp("'", "g"),"").replace(new RegExp(" ", "g"),"").replace(new RegExp("%", "g"),"");
var users = tools.getUsersWithRole(role);
a.rs( "EMPLOYEE.LOGIN in ('" + users.join("','") + "')");