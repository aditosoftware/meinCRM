import("lib_telephony")

var field = new Array("ADDR", "SEARCHADDR");
var type = a.getColumnTypes("COMM", field)
var result = "";
var anz = 0;

ds = a.sql("Select COMMID, ADDR, COUNTRY from COMM join KEYWORD on MEDIUM_ID = KEYVALUE "
            + " join RELATION on COMM.RELATION_ID = RELATIONID join ADDRESS on ADDRESSID = ADDRESS_ID "
            + " where KEYTYPE in (8,7) and KEYNAME2 = 'fon'", a.SQL_COMPLETE);

for ( i = 0; i < ds.length; i++ )
{
    try
    {   
        result = SYSTEM.runPlugin( null, "de.adito.PhoneNumberPlugin.InternationalFormatter", [ ds[i][2], ds[i][1] ]);
    }
    catch(ex)
    {
            log.log(ex)
    }
    if ( result[0] != undefined && result[0] != "" && result[0] != null && ds[i][1] != result[0] )
        anz += a.sqlUpdate("COMM", field, type, [result[0], cleanPhoneNumber( ds[i][1] ).replace(/^0+/, "")], "COMMID = '" + ds[i][0] + "'")
}
a.rs( a.translate("%0 Telefonnummern formatiert!", [anz]) );