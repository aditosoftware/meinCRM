var ids = a.valueofObj("$local.idvalue");

var sqlstr = "select ADDRESSID, 1, ADDR_TYPE, ADDRIDENTIFIER, ADDRESS, BUILDINGNO, ADDRESSADDITION, ZIP, CITY, DISTRICT, REGION, STATE, COUNTRY from ADDRESS where ";

if ( ids != "undefined" )
{
    sqlstr += " ADDRESSID in ('" + ids.join("','") + "')";
}
else
{
    sqlstr += " RELATION_ID = '" + a.valueof("$comp.relationid") + "'";
}

a.rq( sqlstr );