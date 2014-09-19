import("lib_email");
import("lib_keyword");

var keys = a.valueofObj("$sys.selection");
var type = keys[0]["#ADITO_SEARCH_TYPE"];

if ( keys.length == 1 && (  type == "PERS" || type == "ORG" ) )
{
    var relid = keys[0]["#ADITO_SEARCH_ID"];
    var data = a.sql("select " + getCommStandardAddrSQL( type == "ORG" ? "Org" : "Pers", "mail", "RELATIONID" ) 
                    + ", LANG from RELATION where RELATIONID = '" + relid + "'", "AO_DATEN", a.SQL_ROW);
    OpenNewMail(data[0], relid, data[1]);
}