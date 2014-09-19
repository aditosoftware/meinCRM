var id = a.decodeFirst(a.valueof("$comp.tbl_hierarchie") );
if (id != '')
{
	var data = a.getTableData("$comp.tbl_hierarchie", [id]);

	if (data[0][1] == null)	
	{
			var alldata = a.getTableData("$comp.tbl_hierarchie",a.ALL);
			var maxid = 1;
			for ( var i =0; i < alldata.length; i++ )
			{
					if ( alldata[i][1] >= maxid && alldata[i][1] != null )  maxid = eMath.addInt(alldata[i][1], 1);
			}
			a.updateTableCell("$comp.tbl_hierarchie", id, 1, maxid, maxid);
	}
	if (data[0][2] == null)	a.updateTableCell("$comp.tbl_hierarchie", id, 2, 1, 'Ja');

	a.rs( id );
}