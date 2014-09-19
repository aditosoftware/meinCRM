var tree = a.valueofObj("$image.UJUmsatzTree");
var groupfields = a.decodeMS(a.valueof("$comp.UJGruppe"));
var fields = a.decodeMS(a.valueof("$comp.UJFields"));
var groups = a.valueofObj("$image.ujgroups");

if ( tree[""] != undefined )
{
    var actyear = parseInt( date.longToDate( a.valueof("$sys.today"), "yyyy"));
    var colnames = [];
    for ( i = 0; i < 4; i++)   colnames.push(actyear-i) 

    var rptfields = ["Feld_Gruppe"];
    var params = [];

    for ( var i = 0; i < 10 ; i++)  
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
    for ( i = 0; i < colnames.length; i++)    
    {
        params["Param_" + i] = colnames[i].toString();   
    }
    params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

    a.openStaticLinkedReport("RPTJ_TURNOVER_Y_OVERVIEW", false, a.REPORT_OPEN, null, params, rptfields, getData( tree[""].ids, [] ))
}

function getData( pIDs, pData )
{
    for ( var i = 0; i < pIDs.length; i++)
    {
        var id = pIDs[i];
        for ( ir = 0; ir < tree[id].data.length; ir++)
        {
            var row = [];
            row[0] = "";
            if ( ir == 0)
            {
                for ( var r = 0; r < a.decodeMS(id).length-1; r++ )  row[0] += "\t";
                row[0] += tree[id].data[ir].values[0];
            }
            for (  r = 1; r < tree[id].data[ir].values.length; r++ ) 
                row.push( a.formatDouble(tree[id].data[ir].values[r], tree[id].data[ir].format ));
        
            pData.push( row );
        }
        pData = getData( tree[id].ids, pData )
    }  

    return pData;
}
