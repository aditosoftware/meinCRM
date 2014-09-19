var affectedusers = a.valueofObj("$image.affectedusers");
var ids = a.decodeMS(a.valueof("$comp.tblUsers"));
 
var adduser = [];
var insert = true;
for(var i = 0; i < affectedusers.length; i++) // Alle bisher Zugeordneten
{
    for(var v = 0; v < ids.length; v++) // Löschauswahl durchlaufen
    {
        if(ids[v] == affectedusers[i][0] && a.getTableData("$comp.tblUsers", ids[v])[1] == " ") // Zu löschender in Zugeordnete gefunden und nicht Verantwortlicher
        {
            insert = false; // Nicht dem Array hinzufügen, der nachher als Zugeordnete gesetzt wird
            break;
        }
    }
    if(insert)
    {
        adduser.push([affectedusers[i][0], affectedusers[i][1],affectedusers[i][2]]);
    }
    insert = true;
}    

affectedusers = adduser;
a.imagevar("$image.affectedusers", affectedusers)
a.refresh("$comp.tblUsers");