import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

// users mit der Rolle Salesproject 
var users = tools.getUsersWithRole("PROJECT_Projekt");

var data = a.sql("select SALESORDERID, ORDERCODE, ORDERDATE, NET, CURRENCY, ISCHECKED, SENT, " 
    + " (select orgname from org join relation on (orgid = org_id) where relationid = SALESORDER.RELATION_ID) "
    + " from SALESORDER where " + a.valueof("$sys.selection") + " order by ORDERDATE desc", a.SQL_COMPLETE);
for ( var i = 0; i < data.length; i++)
{
    data[i][2] = date.longToDate(data[i][2], "dd.MM.yyyy");
}

var rptfields = ["SALESORDERID", "ORDERCODE", "ORDERDATE", "NET", "CURRENCY", "ISCHECKED", "SENT", "ORG"]

a.openStaticLinkedReport("RPTJ_SALESORDERLIST", false, a.REPORT_OPEN, null, params, rptfields, data );