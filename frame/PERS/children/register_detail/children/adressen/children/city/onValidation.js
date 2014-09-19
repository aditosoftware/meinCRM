import("lib_location");

var city = a.valueof("$comp.CITY");
if(city != "")
{
    var addressid = a.decodeFirst(a.valueof("$comp.tbl_ADDRESS"));
    // die ortsdaten holen und bei bedarf interaktiv aussuchen lassen (letzter parameter auf true)
    var data = new GeoPackage().getLocationsByCity(city + "%", a.valueof("$comp.COUNTRY"), true);
    // locationid, zip, city, district, state 
    if(data.length > 0)   // falls daten da sind
        for (var i = 1; i < 6; i++ )
            a.updateTableCell("$comp.tbl_ADDRESS", addressid, i + 8, data[0][i], data[0][i])
}