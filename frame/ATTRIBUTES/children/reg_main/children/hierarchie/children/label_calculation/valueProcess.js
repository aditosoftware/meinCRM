var id = a.decodeFirst(a.valueof("$comp.tbl_subAttr") );

if (id != '')
{
    var data = a.getTableData("$comp.tbl_subAttr", [id]);

    if (data[0][4] == null)	a.updateTableCell("$comp.tbl_subAttr", id, 4, 1, a.translate("Ja"));
    if (data[0][5] == null)	
    {
        var alldata = a.getTableData("$comp.tbl_subAttr",a.ALL);
        var maxid = 1;
        for ( var i =0; i < alldata.length; i++ )
        {
            if ( alldata[i][5] >= maxid && alldata[i][5] != null )  maxid = eMath.addInt(alldata[i][5], 1);
        }
        a.updateTableCell("$comp.tbl_subAttr", id, 5, maxid, maxid);
    }
}