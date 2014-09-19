var usrlist = tools.getStoredUsers();

var res = [ ["global"], ["system"], ["server"] ];

for(var i=0; i < usrlist.length; i++)
{
    res.push( [usrlist[i][1] ]);
}

a.ro(res);