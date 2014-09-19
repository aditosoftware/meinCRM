import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

// users mit der Rolle Salesproject 
var users = tools.getUsersWithRole("PROJECT_Projekt");

var data = a.sql("select OFFERID, OFFERCODE, VERSNR, OFFERDATE, NET, CURRENCY, " + getKeySQL("OFFERSTATE", "STATUS") 
    + ", (select orgname from org join relation on (orgid = org_id) where relationid = OFFER.RELATION_ID) "
    + " from OFFER where " + a.valueof("$sys.selection") + " order by OFFERDATE desc", a.SQL_COMPLETE);

for ( var i = 0; i < data.length; i++)
{
    data[i][3] = date.longToDate(data[i][3], "dd.MM.yyyy");
}

var rptfields = ["OFFERID", "OFFERCODE", "VERSNR", "OFFERDATE", "NET", "CURRENCY", "STATUS", "ORG"]

a.openStaticLinkedReport("RPTJ_OFFERLIST", false, a.REPORT_OPEN, null, params, rptfields, data );
