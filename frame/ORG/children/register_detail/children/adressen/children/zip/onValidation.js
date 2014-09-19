import("lib_location");

var zip = a.valueof("$comp.ZIP");
if(zip != "")
{
    var addressid = a.decodeFirst(a.valueof("$comp.tbl_ADDRESS"));
    // die ortsdaten holen und bei bedarf interaktiv aussuchen lassen (letzter parameter auf true)
    var data = new GeoPackage().getLocationsByZip(zip + "%", a.valueof("$comp.COUNTRY"), true);
    // locationid, zip, city, district, state 
    if(data.length > 0)   // falls daten da sind
        for (var i = 1; i < 6; i++ )
            a.updateTableCell("$comp.tbl_ADDRESS", addressid, i + 6, data[0][i], data[0][i])
}