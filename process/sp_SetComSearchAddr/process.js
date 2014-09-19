import("lib_telephony");
var field = new Array("SEARCHADDR");
var type = a.getColumnTypes("COMM", field)

ds = a.sql("Select COMMID, ADDR from COMM join KEYWORD on ( MEDIUM_ID = KEYVALUE ) where KEYTYPE in (8,7) and KEYNAME2 = 'fon'", a.SQL_COMPLETE);

for ( i = 0; i < ds.length; i++ )
{
    a.sqlUpdate("COMM", field, type, new Array( cleanPhoneNumber( ds[i][1] ).replace(/^0+/, "")), "COMMID = '" + ds[i][0] + "'")
}
a.rs( i + " " + a.translate("Telefonnummern bereinigt!") );