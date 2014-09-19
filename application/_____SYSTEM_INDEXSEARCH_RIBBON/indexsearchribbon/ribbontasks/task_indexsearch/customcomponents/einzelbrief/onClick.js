import("lib_wordbrf");

var keys = a.valueofObj("$sys.selection");

if ( keys.length == 1 && ( keys[0]["#ADITO_SEARCH_TYPE"] == "PERS" || keys[0]["#ADITO_SEARCH_TYPE"] == "ORG" ) )
{
    var relid = keys[0]["#ADITO_SEARCH_ID"];
    var data = a.sql("select ADDRESS_ID, LANG from RELATION where RELATIONID = '" + relid + "'", "AO_DATEN", a.SQL_ROW);
    writeLetter( relid, data[0], data[1] );
}
