import("lib_calendar");

var ret = "";
if ( a.hasvar("$image.affectedusers"))  
{
    var users = a.getTableData("$comp.tblUsers", a.ALL);
    var overlapping = getOverlappingEvents(a.valueof("$comp.start_date"), a.valueof("$comp.end_date"), users  );        
    if ( overlapping.length > 0 )  ret =  overlapping.length + " " + a.translate("Terminkollisionen") + "   ";
    var info = "";
    var ids = [];
    for ( var i = 0; i < overlapping.length; i++)
    {    
        info += overlapping[i][0] + ": " + overlapping[i][1] + "\n";
        ids.push(overlapping[i][2]);
    }
    a.imagevar("$image.overlappingids", ids);
    a.imagevar("$image.overlapping", info);
}
a.rs(ret);
