a.imagevar("$image.xmldirection", "imp");

var filename = a.valueof("$comp.edtImportFile");

if(filename != "")
{
    var s = a.doClientIntermediate(a.CLIENTCMD_GETDATA, new Array(filename));

    var xmldoc = new XML(s);
    var tables = xmldoc..table;
    var tbl = new Array();
    for(var i = 0; i < tables.length(); i++)
    {
        var tblname = tables[i].@name;
        var tbllong = tables[i].tableinfo.longname;
        tbl.push( new Array(tblname, tbllong, tblname) );
    }
    a.imagevar("$image.tablearray", tbl);
}