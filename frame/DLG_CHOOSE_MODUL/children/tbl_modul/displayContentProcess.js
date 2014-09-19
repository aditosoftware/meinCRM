var moduls = a.valueofObj("$local.modul");
var res = [];

for(var i=0; i < moduls.length; i++)
{
    //	a.showMessage(moduls[i][0] + "--" + moduls[i][1])
    var title = a.translate( moduls[i][1] );
    res.push( [moduls[i][0] , title ] );
}
a.ro(res);