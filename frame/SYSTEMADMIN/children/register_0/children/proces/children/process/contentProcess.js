import("lib_timer");

// liefert eine liste aller prozesse

var liste = a.getDataModels(a.DATAMODEL_KIND_PROCESS);

var res = new Array();

for(var i = 0; i < liste.length; i++)
{
    if(liste[i][1] != "" && liste[i][0].substr(0,3) == "sp_")
    {
        var x = new Array(liste[i][0], liste[i][1]);
        res.push(x);
    }
}

a.ro(res);