import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from ASYS_ICONS where DESCRIPTION = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

var tel = getKeyValue("Telefon", "OrgMedium" );
var web = getKeyValue("Internet", "OrgMedium" );
var data = a.sql("select RELATIONID, CUSTOMERCODE, ORGNAME, " + concat(["ADDRESS", "BUILDINGNO"]) + ", "
    + concat(["COUNTRY", "'-'", "ZIP", "CITY"]) + ", "
    + getKeySQL("SPRACHE", "RELATION.LANG") + ", " 
    + " RELATION.SOURCE, " + getAttrSQL("Branche", "RELATIONID") + ", " + getAttrSQL("Aussendienst", "RELATIONID") + ", "
    + " ( select max(addr) from comm where MEDIUM_ID = " + tel + " and COMM.RELATION_ID = RELATIONID ) " 
    + ", ( select max(addr) from comm where MEDIUM_ID = " + web + " and COMM.RELATION_ID = RELATIONID ) "
    + " from RELATION join ADDRESS on ADDRESSID = RELATION.ADDRESS_ID join ORG on (ORGID = ORG_ID) where " 
    + a.valueof("$sys.selection") + " order by ORGNAME", a.SQL_COMPLETE);

var rptfields = ["RELATIONID", "CUSTOMERCODE", "ORGNAME", "ADDRESS", "COUNTRYZIPCITY", "LANGUAGE", "SOURCE", "BRANCH", "SALESREPRESENTATIVE", "TEL", "WEB"];

a.openStaticLinkedReport("RPTJ_ORGLIST", false, a.REPORT_OPEN, null, params, rptfields, data );