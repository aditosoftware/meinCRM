import("lib_sql");
import("lib_attr");

var params = new Array;
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");

var data = a.sql("select RELATIONID, " + concat(["salutation", "title", "firstname", "lastname"]) + ", ORGNAME, " 
    + " RELPOSITION, RELTITLE, DOB, 'DOBMONTH', 'DOBDAY' "
    + " from RELATION join ORG on ORGID = ORG_ID join PERS on PERSID = PERS_ID" 
    + " where " + getAttrSQL("Betreuung.Geburtstagsliste", "RELATION.RELATIONID") 
    + " = 'Ja' and DOB is not null and RELATION.STATUS = 1 order by lastname", a.SQL_COMPLETE);

for ( var i = 0; i < data.length; i++)
{
    data[i][5] = date.longToDate(data[i][5], "dd.MM.yyyy");
    data[i][6] = data[i][5].substr(3, 2);
    data[i][7] = data[i][5].substr(0, 2);
}

var rptfields = ["RELATIONID", "NAME", "ORGNAME", "RELPOSITION", "RELTITLE", "DOB", "DOBMONTH", "DOBDAY"];

a.openStaticLinkedReport("RPTJ_BIRTHDAYLIST", false, a.REPORT_OPEN, null, params, rptfields, data );
