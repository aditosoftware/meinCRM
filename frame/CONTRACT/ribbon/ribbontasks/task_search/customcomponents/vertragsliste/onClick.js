import("lib_keyword");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

var data = a.sql("select CONTRACTID, CONTRACTCODE, CONTRACTSTART, CONTRACTEND, " 
    + getKeySQL("CONTRACTTYPE", "CONTRACTTYPE") + ", " + getKeySQL("CONTRACTSTATUS", "CONTRACTSTATUS") + ", REMARK, " 
    + " (select orgname from org join relation on (orgid = org_id) where relationid = CONTRACT.RELATION_ID) "
    + " from CONTRACT where " + a.valueof("$sys.selection") + " order by CONTRACTSTART desc", a.SQL_COMPLETE);
for ( var i = 0; i < data.length; i++)
{
    data[i][2] = date.longToDate(data[i][2], "dd.MM.yyyy");
    data[i][3] = date.longToDate(data[i][3], "dd.MM.yyyy");
}

var rptfields = ["CONTRACTID", "CONTRACTCODE", "CONTRACTSTART", "CONTRACTEND", "CONTRACTTYPE", "CONTRACTSTATUS", "REMARK", "ORG"]

a.openStaticLinkedReport("RPTJ_CONTRACTLIST", false,a.REPORT_OPEN, null, params, rptfields, data );
