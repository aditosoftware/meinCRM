import("lib_addr");
import("lib_keyword");

var id = a.valueof("$comp.idcolumn");
var sprache = getKeyName(a.valueof("$comp.LANGUAGE"), "SPRACHE", "keyname2");

//Daten für Hauptbericht
var rptdata = a.sql("select PAYED, RELATION_ID, CURRENCY, ORDERDATE, VAT, ORDERCODE, NET, '' as brutto, '' as offen "
                    + "from SALESORDER where SALESORDERID = '" + id + "' ", a.SQL_COMPLETE);
var columnNames = ["PAYED", "RELATION_ID", "CURRENCY", "ORDERDATE", "VAT", "ORDERCODE", "NET", "BRUTTO", "OFFEN"];

for(var i = 0; i < rptdata.length; i++)
{
    //Berechnung und Formatierung der Daten (kann im Report nicht vorgenommen werden)
    rptdata[i][3] = date.longToDate(rptdata[i][3], "dd.MM.yyyy");
    rptdata[i][7] = eMath.addDec(rptdata[i][6], rptdata[i][4]);
       
    rptdata[i][8] = eMath.subDec(rptdata[i][7], rptdata[i][0])
    
    rptdata[i][7] = a.formatDouble(rptdata[i][7], "#,##0.00" );
    rptdata[i][8] = a.formatDouble(rptdata[i][8], "#,##0.00" );
}

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["Kontenabstimmung"] = a.translate("Kontenabstimmung", sprache);
params["Rech.-Nr"] = a.translate("Rech.-Nr", sprache);
params["Rech.-Datum"] = a.translate("Rech.-Datum", sprache);
params["fällig"] = a.translate("fällig", sprache);
params["Rech.-Betrag"] = a.translate("Rech.-Betrag", sprache);
params["offen"] =  a.translate("offen", sprache);
params["ADRESSE"] = a.valueof("$comp.ADDRESS_INVOICE"); 
params["FAELLIG"] = date.longToDate(a.valueof("$comp.zahlungsziel"), "dd.MM.yyyy");

a.openStaticLinkedReport("RPTJ_REMINDER", false, a.REPORT_OPEN, null, params, columnNames, rptdata)