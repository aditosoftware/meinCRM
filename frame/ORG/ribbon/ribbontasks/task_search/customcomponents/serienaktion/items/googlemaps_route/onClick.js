import("lib_util");
import("lib_addr");

var condition = "";
var framecondition = a.valueof("$sys.selection"); 
if (framecondition != "") condition = " where " + framecondition;

var sql = "select " + concat(["ADDRESS","BUILDINGNO"]) + ", ZIP, CITY from ADDRESS join RELATION on ADDRESSID = ADDRESS_ID "
+ " join ORG on ( ORGID = ORG_ID and PERS_ID is null ) " + condition + " order by zip";

var dest = a.sql(sql, a.SQL_COMPLETE);
var saddr = new AddrObject( a.valueof("$global.user_relationid")).formatAddress("{al} {bn}+{zc}+{ci}");

if ( dest.length < 31 )
{
    var url = "http://maps.google.de/maps?f=q&hl=de&saddr=" + saddr + "&daddr=" + dest[dest.length-1].join("+");
    for (var i = 0; i < dest.length -1; i++)		url += "+to:" + dest[i].join("+");
    openUrl( url );
}
else a.showMessage("max. 30 Firmen auswählen !")