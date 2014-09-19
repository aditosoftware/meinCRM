import("lib_calendar");

var data = a.getTableData("$comp.tbl_Ressources", a.decodeMS(a.valueof("$comp.tbl_Ressources"))); 

for(var i = 0; i < data.length; i++)
{
    if ( !tools.existUsers(data[i][3] ))
    {
        user = new Array();
        user[tools.TITLE] = data[i][3];
        user[tools.PARAMS] = new Array();
        user[tools.PASSWORD] = "";
        user[tools.ROLES] = ["PROJECT_Ressource"]; 
        user[tools.PARAMS][tools.FIRSTNAME] = data[i][3];
        user[tools.PARAMS][tools.LASTNAME] = "";
        user[tools.PARAMS][tools.EMAIL] = a.getNewUUID();
        user[tools.PARAMS][tools.IS_ENABLED] = "true";
        tools.insertUser(user);
    }
    else
    {
        user = tools.getUser(data[i][3]);
        user[tools.ROLES] = ["PROJECT_Ressource"]; 
        user[tools.PARAMS][tools.IS_ENABLED] = "true";
        tools.updateUser(user);
    }
}
setCalendarGrant();
a.refresh("$comp.tbl_Ressources");