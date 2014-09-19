import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

// users mit der Rolle Serviceauftrag 
var users = tools.getUsersWithRole("PROJECT_Service");

var data = a.sql("select SERVICEORDERID, SERVICEORDERCODE, ORGNAME, SERVICEINFO, " + getKeySQL("SERVICETYPE", "SERVICETYPE") + ", " 
    + getKeySQL("SERVICESTATUS", "SERVICESTATUS") + ", SERVICEORDER.DATE_NEW"
    + " from SERVICEORDER join RELATION on RELATIONID = SERVICEORDER.RELORG_ID join ORG on ORGID = RELATION.ORG_ID "
    + " where " + a.valueof("$sys.selection") + " order by SERVICESTATUS desc", a.SQL_COMPLETE);

for ( var i = 0; i < data.length; i++)
{
    data[i][6] = date.longToDate(data[i][6], "dd.MM.yyyy");
}

var rptfields = ["SERVICEORDERID", "SERVICEORDERCODE", "COMPANY", "SERVICEINFO", "SERVICETYPE", "SERVICESTATUS", "DATE_NEW"]

a.openStaticLinkedReport("RPTJ_SERVICEORDERLIST", false, a.REPORT_OPEN, null, params, rptfields, data );