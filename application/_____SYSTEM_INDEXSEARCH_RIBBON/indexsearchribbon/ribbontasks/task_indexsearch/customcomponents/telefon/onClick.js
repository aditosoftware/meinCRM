import("lib_telephony");
import("lib_keyword");

var keys = a.valueofObj("$sys.selection");
var type = keys[0]["#ADITO_SEARCH_TYPE"];

if ( keys.length == 1 && (  type == "PERS" || type == "ORG" ) )
{
    var relid = keys[0]["#ADITO_SEARCH_ID"];
    var adress = a.sql("select " + getCommStandardAddrSQL( type == "ORG" ? "Org" : "Pers", "fon", "RELATIONID" ) 
                            + " from RELATION where RELATIONID = '" + relid + "'");
    call(adress);
}
