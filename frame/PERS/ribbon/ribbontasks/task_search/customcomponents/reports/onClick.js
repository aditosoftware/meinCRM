import("lib_keyword");
import("lib_sql");
import("lib_attr");

var params = new Array;
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["Personenliste"] = a.translate("Personenliste");
params["Person"] = a.translate("Person");
params["Firma"] =  a.translate("Firma");
params["Position"] = 	a.translate("Position");
params["Funktion"] = a.translate("Funktion");
params["Telefon"] = a.translate("Telefon");
params["Email"] = a.translate("Email");
params["bevorzugter Infokanal"] = a.translate("bevorzugter Infokanal");
params["Loyalität"] = a.translate("Loyalität");

var data = a.sql("select RELATIONID, " + concat(["salutation", "title", "firstname", "lastname"]) + ", ORGNAME, " 
    + " RELPOSITION, RELTITLE, '', "
    + " SOURCE, FAVORITECHANNEL, " + getAttrSQL("Loyalität", "RELATIONID") + ", " 
    + getCommAddrSQL( "Pers", "Telefon Büro", "RELATIONID" ) + ", "
    + getCommAddrSQL( "Pers", "Email Büro", "RELATIONID" )
    + " from RELATION join ORG on (ORGID = ORG_ID) join PERS on (PERSID = PERS_ID) where " 
    + a.valueof("$sys.selection") + " order by lastname", a.SQL_COMPLETE);

for ( var i = 0; i < data.length; i++)
{
    data[i][8] = a.translate(data[i][8]);
}



var rptfields = ["RELATIONID", "NAME", "ORGNAME", "RELPOSITION", "RELTITLE", "LANGUAGE", "SOURCE", "INFOKANAL", "LOYALITAET", "TEL", "EMAIL"];

a.openStaticLinkedReport("RPTJ_PERSLIST", false, a.REPORT_OPEN, null, params, rptfields, data );