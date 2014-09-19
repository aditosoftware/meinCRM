import("lib_util");

var addressid = a.decodeFirst(a.valueof("$comp.tbl_ADDRESS"))
if ( addressid == "" ) 	addressid = a.valueof("$comp.ADDRESS_ID");
var adresse = a.sql("select ADDRESS, ZIP, CITY from ADDRESS where ADDRESSID = '" + addressid + "'", a.SQL_ROW);

if ( adresse.length > 0 )
{
    adresse = "http://maps.google.de/maps?f=q&hl=de&q=" + adresse[0] + "+" + adresse[1] + "+" + adresse[2];
    openUrl(adresse);
}