import("lib_user");
import("lib_themetree");

var affectedusers = a.valueofObj("$image.affectedusers");
var user = a.decodeMS(a.valueof("$comp.treeThemen"));
var adduser = [];

if ( user[0] == "U")
{
    var insert = true;
    for(var i = 0; i < affectedusers.length; i++)
    {
        if(affectedusers[i][0] == user[1])
        {
            insert = false;
        }
    }
    if(insert == true)
    {    
        adduser.push([user[1], " " ,user[2]]);
    }    
}
else
{
    var childs = [];
    getAllChilds(user[1], childs); // Alle untergeordneten Abteilungen holen
    for(var z = 0; z < childs.length; z++)
    {
        var node = getUsersByDepartment( childs[z] ); // Alle User für die Abteilung holen
        for ( i = 0; i < node.length; i++ )  
        {
            insert = true;
            for(var j = 0; j < affectedusers.length; j++)
            {
                if(affectedusers[j][0] == node[i][0])
                {
                    insert = false;
                }
            }
            if(insert == true)
            {    
                adduser.push([node[i][0], " " ,node[i][1]]);  
            }  
        }
    }
}

affectedusers = affectedusers.concat(adduser);
a.imagevar("$image.affectedusers", affectedusers)
a.refresh("$comp.tblUsers");
a.refresh("$comp.btn_add");