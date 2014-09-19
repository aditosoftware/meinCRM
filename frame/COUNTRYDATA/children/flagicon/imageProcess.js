var iso2 = a.valueof("$comp.ISO2");

if (iso2 != "")
{
    var bild = a.sql("select FLAGICON from COUNTRYINFO where ISO2 = '" + iso2 + "'");
    a.rd(bild);
}