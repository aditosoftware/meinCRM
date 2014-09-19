var affectedusers = a.valueofObj("$image.affectedusers");
var id = a.decodeFirst(a.valueof("$comp.tblUsers"));

if(a.getTableData("$comp.tblUsers", id)[1] != " ")
{
    a.showMessage("Der Verantwortliche kann nicht gelöscht werden!");
}    

else
{    
    var adduser = [];

    for(var i = 0; i < affectedusers.length; i++)
    {    
        if(id != affectedusers[i][0])
        {
            adduser.push([affectedusers[i][0], affectedusers[i][1],affectedusers[i][2]])
        }
    }    

    affectedusers = adduser;
    a.imagevar("$image.affectedusers", affectedusers)
    a.refresh("$comp.tblUsers");
}