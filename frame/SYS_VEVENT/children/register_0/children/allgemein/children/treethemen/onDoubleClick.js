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
else if(user[0] == "R")
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
        var childs = [];
        getAllChilds(user[1], childs);
        for(var i = 0; i < childs.length; i++)
        {
            var th = a.sql("select count(*) from THEME where THEME_ID = '" + childs[i] + "'");
            if(th == 0) // Wenn keine Unterthemen vorhanden, dann ist es der letzte Punkt
            {
                var insert = true;
                for(var j = 0; j < affectedusers.length; j++)
                {
                    if(affectedusers[j][0] == childs[i])
                    {
                        insert = false;
                    }
                }
                if(insert == true)
                {    
                    var theme = a.sql("select THEME from THEME where THEMEID = '" + childs[i] + "'");
                    var getuser = "";
                    try
                    {
                        getuser = tools.getUser(theme);
                    }
                    catch(err){}
                    if(getuser != "")
                    {
                        adduser.push([childs[i], " ", theme]);
                    }
                }    
            }
        }
    }
}
else
{
    var childs = [];
    getAllChilds(user[1], childs); // Alle untergeordneten Abteilungen holen
    for(var z = 0; z < childs.length; z++)
    {
        var node = getUsersByDepartment( childs[z] ); // Alle User für die Abteilung holen
        for (var i = 0; i < node.length; i++ )  
        {
            var insert = true;
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