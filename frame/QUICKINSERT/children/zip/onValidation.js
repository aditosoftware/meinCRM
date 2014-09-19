import("lib_location");

var zip = a.valueof("$comp.zip");
if( a.valueofObj("$image.CheckAddr") && zip != "" && ( !a.hasvar("$image.check") || a.valueofObj("$image.check") ) )
{
    // die ortsdaten holen und bei bedarf interaktiv aussuchen lassen (letzter parameter auf true)
    var data = new GeoPackage().getLocationsByZip(zip + "%", a.valueof("$comp.country"), true);
    // locationid, zip, city, district, state 
    if(data.length > 0)   // falls daten da sind
    {
        a.imagevar("$image.check", false);
        a.setValue("$comp.zip", data[0][1]);
        a.setValue("$comp.city", data[0][2]);
        a.imagevar("$image.check", true);
    }
}