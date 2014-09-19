import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");

var data = a.sql("select RELATIONID, " + concat(["salutation", "title", "firstname", "lastname"]) + ", ORGNAME, " 
    + " RELPOSITION, RELTITLE, '', "
    + " RELATION.SOURCE, FAVORITECHANNEL, " 
    + getCommAddrSQL( "Pers", "Telefon Büro", "RELATIONID" ) + ", "
    + getCommAddrSQL( "Pers", "Email Büro", "RELATIONID" )
    + " from RELATION join ORG on (ORGID = ORG_ID) join PERS on (PERSID = PERS_ID) join ADDRESS on ADDRESSID = ADDRESS_ID"
    + " where " + a.valueof("$sys.selection") + " order by lastname", a.SQL_COMPLETE);

for ( var i = 0; i < data.length; i++)
{
    data[i][8] = a.translate(data[i][8]);
}



var rptfields = ["RELATIONID", "NAME", "ORGNAME", "RELPOSITION", "RELTITLE", "LANGUAGE", "SOURCE", "INFOKANAL", "TEL", "EMAIL"];

a.openStaticLinkedReport("RPTJ_PERSLIST", false, a.REPORT_OPEN, null, params, rptfields, data );