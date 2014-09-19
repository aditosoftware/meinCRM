var country = a.sql("select COUNTRY from ADDRESS where ADDRESSID = '" + a.valueof("$comp.ADDRESSID") + "'");

if (country != "" && a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW)
{
    var bild = a.sql("select FLAGICON from COUNTRYINFO where ISO2 = '" + country + "'");
    a.rd(bild);
}