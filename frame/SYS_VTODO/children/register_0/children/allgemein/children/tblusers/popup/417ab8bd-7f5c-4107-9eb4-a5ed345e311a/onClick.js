var affectedusers = a.valueofObj("$image.affectedusers");
var newLeader = a.decodeFirst(a.valueof("$comp.tblUsers"));



var event = a.valueofObj("$image.entry");
var adduser = [];

for(var i = 0; i < affectedusers.length; i++)
{    
    if(newLeader == affectedusers[i][0])
    {
        adduser.push([affectedusers[i][0], "-3407821" ,affectedusers[i][2]])
    }
    else
    {
        adduser.push([affectedusers[i][0], " " ,affectedusers[i][2]])
    }
}  

affectedusers = adduser;
a.imagevar("$image.affectedusers", affectedusers)
a.refresh("$comp.tblUsers");
event[calendar.USER] = newLeader;
a.refresh("$comp.btn_del");