import("lib_frame");

var fd = new FrameData();
var moduls = fd.getData("modul", true, ["name", "title", "table", "idcolumn"]);
var res = [];

for(var i=0; i < moduls.length; i++)
{
    var title = a.translate( moduls[i][1] );
    res.push([a.encodeMS( [moduls[i][0], moduls[i][1], moduls[i][2], moduls[i][3]] ), title ]);
}
a.ro(res);