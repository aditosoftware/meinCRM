import("lib_timer");

// liefert eine liste aller prozesse
var liste = a.getDataModels(a.DATAMODEL_KIND_PROCESS);

var res = new Array();
var showall = a.valueof("$comp.chkShowAll");

for(var i = 0; i < liste.length; i++)
{
    var procname = liste[i][0]
    if((showall == "Y" && procname.substr(0,4) != "lib_" ) || ((showall == "N") && (procname.substr(0,3) == "sp_")))
    {
        var x = new Array(procname, liste[i][1] + " (" + procname + ")");
        res.push(x);
    }
}
a.ro(res);