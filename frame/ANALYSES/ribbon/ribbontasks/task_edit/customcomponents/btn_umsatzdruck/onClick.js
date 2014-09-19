var tree = a.valueofObj("$image.UmsatzTree");
var groupfields = a.decodeMS(a.valueof("$comp.Gruppe"));
var fields = a.decodeMS(a.valueof("$comp.Fields"));
var groups = a.valueofObj("$image.groups");
var header = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", "Gesamt"];
var rptfields = ["Feld_Gruppe"];
var params = [];

if ( tree[""] != undefined )
{
    for ( var i = 0; i < 13 ; i++)  
    {    
        rptfields.push("Feld_" + i)
    }
    params["Param_Gruppe"] = groups[0][1];

    for ( i = 1; i < groupfields.length; i++)  
    {
        var space = "\n"
        for ( r = 0; r < i; r++)  space += "\t";
    
        params["Param_Gruppe"] += space + groups[i][1];
    }

    for ( i = 0; i < header.length; i++)    params["Param_" + i] = header[i];

    var data = getData( tree[""].ids, [] );
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

    a.openStaticLinkedReport("RPTJ_TURNOVER_OVERVIEW", false, a.REPORT_OPEN, null, params, rptfields, getData( tree[""].ids, [] ))
}

function getData( pIDs, pData )
{
    for ( var i = 0; i < pIDs.length; i++)
    {
        var id = pIDs[i];
        for ( ir = 0; ir < tree[id].data.length; ir++) //Zeilen 
        {
            var row = [];
            row[0] = "";
            if ( ir == 0)
            {
                for ( var r = 0; r < a.decodeMS(id).length-1; r++ )  row[0] += "\t";
                row[0] += tree[id].data[ir].values[0];
            }
            for (  r = 1; r < tree[id].data[ir].values.length; r++ ) 
                row.push( a.formatDouble(tree[id].data[ir].values[r], tree[id].data[ir].format));
            pData.push( row );
        }
        pData = getData( tree[id].ids, pData )
    }  
    return pData;
}
