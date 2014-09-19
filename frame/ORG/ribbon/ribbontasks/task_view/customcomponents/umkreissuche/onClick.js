import("lib_location");
import("lib_sql");

var addressid = a.decodeFirst(a.valueof("$comp.tbl_ADDRESS"))
if ( addressid == "" ) 	addressid = a.valueof("$comp.ADDRESS_ID");

var country = a.sql("select COUNTRY from ADDRESS where ADDRESSID = '" + addressid + "'");
var zip = a.sql("select ZIP from ADDRESS where ADDRESSID = '" + addressid + "'");
var geodata = new GeoPackage();
var distance = a.askQuestion("Umkreis in km =", a.QUESTION_EDIT, "")
if (distance > "50") a.showMessage("max. 50 km erlaubt!")
else
{
    if (distance != null && distance != '')
    {
        var tablevalues = [];

        var geoid = a.sql("select LOCATIONID from AOSYS_LOCATION where COUNTRY = '" + country + "' and ZIP = '" + zip + "'");
        if(geoid != "")
        {
            var geodataresult = geodata.searchLocationDistance(geoid, distance);
            for(x = 0; x < geodataresult.length; x++)
            {
                tablevalues.push(geodataresult[x][2] + geodataresult[x][0])
            }			
            var sql = "(select ORG_ID from RELATION join ADDRESS on ADDRESS_ID = ADDRESSID and PERS_ID is null"
            + " where " + concat(["COUNTRY", "ZIP"], "") + " in ('" + tablevalues.join("','") + "') )";
            a.openLinkedFrame("ORG", " ORG.ORGID in " + sql, false, a.FRAMEMODE_TABLE_SELECTION, "", null, false);
        }
        else a.showMessage("PLZ in Location-Tabelle nicht vorhanden")
    }
}