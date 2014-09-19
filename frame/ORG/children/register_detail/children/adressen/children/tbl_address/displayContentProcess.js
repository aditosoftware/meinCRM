import("lib_keyword");

var address = a.createEmptyTable(11);

var relationid = a.valueof("$comp.relationid");
if ( relationid != "") 
{
    sqlstr = "select ADDRESSID, case when ADDRESSID = (select ADDRESS_ID from RELATION where RELATIONID = '" + relationid + "') then -51 else -1 end, " + getKeySQL( "AdressTyp", "ADDR_TYPE" ) 
        + ", ADDRIDENTIFIER, ADDRESS, BUILDINGNO, ADDRESSADDITION, ZIP, CITY, DISTRICT, REGION, STATE, NAME_DE" 
        + " from ADDRESS left join COUNTRYINFO on ISO2 = COUNTRY where RELATION_ID = '" + relationid + "'";

    address = a.sql( sqlstr, a.SQL_COMPLETE );
    for (i = 0; i < address.length; i++)
    {
        address[i][12] = a.translate(address[i][12]);
    }
}
a.ro(address)