var mode =  a.valueof("$sys.workingmode");
var machineid = a.valueof("$comp.MACHINE_ID");
if( mode == a.FRAMEMODE_EDIT || mode == a.FRAMEMODE_NEW )
{
    var id = a.decodeFirst(a.valueof("$comp.Table_Items"));
    var x = a.valueof("$comp.item_groupcodeid");
    if ( id != "" )
    {
        var gc = a.getTableData("$comp.Table_Items", [ id ])[0];
        if (gc[2] != '' && gc[2] != undefined )
        {
            // Ausschluss der schon in der Tabelle ausgewählten Produkte:
            if (gc[2] == 5 && machineid != '') // Ersatzteile
            {
                var noitem = [];
                var alldata = a.getTableData("$comp.Table_Items",a.ALL);
                for ( var i =0; i < alldata.length; i++ ) 
                    if (alldata[i][3] != '' && alldata[i][3] != gc[3] ) noitem.push ([alldata[i][3]])

                a.rq("select PRODUCTID, PRODUCTNAME from PRODUCT join PROD2PROD on PRODUCTID = SOURCE_ID "
                    + " where GROUPCODEID = " + gc[2] + " and PRODUCTID not in ('" + noitem.join("','") + "') and "
                    + " DEST_ID = (select PRODUCT_ID from MACHINE where MACHINEID = '" + machineid + "')");
            }
            else
                a.rq("select PRODUCTID, PRODUCTNAME from PRODUCT where GROUPCODEID = " + gc[2] );
				
        }
    }
}