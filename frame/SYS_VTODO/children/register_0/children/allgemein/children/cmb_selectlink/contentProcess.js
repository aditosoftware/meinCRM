var images = a.getTopImages();
var links = a.getTableData("$comp.links", a.INSERTED)
var list = [];
for (var i = 0; i < images.length; i++)
{
    if ( parseInt(images[i][6]) == a.FRAMEMODE_SHOW )  
    {
        var RowData = a.getCurrentRowData(images[i][0], images[i][1])[0];
        if (RowData != undefined)
        {
            var id = a.encodeMS( [ RowData[0], RowData[1], RowData[2], RowData[3], images[i][3], images[i][4] + " - " + images[i][5] ] );
            for ( var y = 0; y < links.length; y++ )
            {
                if (links[y][1] == id)  break;
            }
            if ( y == links.length )	list.push([id, images[i][4] + " - " + images[i][5]]);
        }
    }
}
a.returnobject(list);