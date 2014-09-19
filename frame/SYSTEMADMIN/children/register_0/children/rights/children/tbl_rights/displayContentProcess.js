import("lib_frame");

var fd = new FrameData();
var users = tools.getStoredUsers();
var userindex = [];
for ( var i = 0; i < users.length; i++ )	userindex[users[i][0]] = users[i][1]; 	
var roles = tools.getAllRoles([]);
var list = a.sql("select TABLEACCESSID, ROLEID, FRAME_ID, PRIV_INSERT, PRIV_EDIT, PRIV_DELETE "
    + " from TABLEACCESS where TATYPE = 'F'", a.SQL_COMPLETE);

for ( i = 0; i < list.length; i++ )		
{   
    if ( list[i][1].substr( 0, 9) == "_____USER" )  list[i][1] = userindex[list[i][1]] + " / " + a.translate("User");                    
    else
    {
        if( roles[list[i][1]] != undefined ) list[i][1] = roles[list[i][1]][0]; 
        list[i][1] += " / " + a.translate("Rolle");
    }
    list[i][2] = fd.getData("id",list[i][2],["title"]);
}
a.returnobject(list);
