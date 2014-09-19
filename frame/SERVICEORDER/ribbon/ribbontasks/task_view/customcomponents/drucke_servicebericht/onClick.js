import("lib_addr");
import("lib_keyword");

var id = a.valueof("$comp.idcolumn");
var rpt = "RPT_SERVICEORDER";
var relid = a.valueof("$comp.RELATION_ID");
var addrobj = new AddrObject( relid );

//Sprache der jeweiligen Firma für Übersetzung verwenden
var lang = a.sql("select LANG from RELATION where RELATIONID = '"+ relid +"'"); 
var sprache = getKeyName(lang , "SPRACHE", "keyname2");

var rptdata = a.sql("select SERVICEORDERID, SERVICEEND, SERVICELOCATION, SERVICESTART, SERVICEORDERCODE, REPORT,"
    + getKeySQL("Einheiten", "SERVICEITEM.UNIT") + ", SERVICEITEM.ITEMSORT, coalesce(SERVICEITEM.DISCOUNT, 0), coalesce(SERVICEITEM.QUANTITY, 0),"
    + " SERVICEITEM.OPTIONAL, coalesce(SERVICEITEM.PRICE, 0), PRODUCTCODE, PRODUCTNAME, SERIALNUMBER, 0 as Einzelpreis, 0 as Summe"
    + " from SERVICEORDER"
    + " join SERVICEITEM on SERVICEITEM.SERVICEORDER_ID = SERVICEORDERID"
    + " left outer join MACHINE on MACHINE.MACHINEID = SERVICEORDER.MACHINE_ID"
    + " join PRODUCT on SERVICEITEM.PRODUCT_ID = PRODUCTID"
    + " where SERVICEORDERID = '"+ id +"'", a.SQL_COMPLETE);

var columnNames = ["SERVICEORDERID", "SERVICEEND", "SERVICELOCATION", "SERVICESTART", "SERVICEORDERCODE", "REPORT", "UNIT", "ITEMSORT", 
"DISCOUNT", "QUANTITY", "OPTIONAL", "PRICE", "PRODUCTCODE", "PRODUCTNAME", "SERIALNUMBER", "Einzelpreis", "Summe"];

var total = 0;
var sum = 0;
for(var i = 0; i < rptdata.length; i++)
{
    rptdata[i][1] = date.longToDate(rptdata[i][1], "dd.MM.yyyy");
    rptdata[i][3] = date.longToDate(rptdata[i][3], "dd.MM.yyyy");
    rptdata[i][15] = eMath.divDec(eMath.mulDec(rptdata[i][11], eMath.subDec(100, rptdata[i][8] )), 100);    
    sum = eMath.mulDec(rptdata[i][15] ,rptdata[i][9]);
    total += sum;
    rptdata[i][15] = a.formatDouble(rptdata[i][15], "#,##0.00");
    rptdata[i][16] = a.formatDouble(sum, "#,##0.00");
    rptdata[i][9] = a.formatDouble(rptdata[i][9], "#,##0");
}

var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["Artikelbezeichnung"] = a.translate("Artikelbezeichnung", sprache);
params["Artikel-Nr"] = a.translate("Artikel-Nr", sprache);
params["Einzelpreis"] = a.translate("Einzelpreis", sprache);
params["Menge"] = a.translate("Menge", sprache);
params["Servicebericht"] = a.translate("Servicebericht", sprache);
params["Datum"] = 	a.translate("Datum", sprache);
params["Nummer"] = a.translate("Nummer", sprache);
params["Summe"] = 	a.translate("Summe", sprache);
params["SERVICEORDERAddr"] = addrobj.getFormattedAddress();
params["Machinetype"] = a.sql("select PRODUCTNAME from PRODUCT where PRODUCTID = (select PRODUCT_ID from MACHINE where MACHINEID = '" 
    + a.valueof("$comp.MACHINE_ID") + "')");
params["TOTAL"] = total;

if(rptdata.length > 0)
{
    a.openStaticLinkedReport("RPTJ_SERVICEORDER", false, a.REPORT_OPEN, null, params, columnNames, rptdata);
    // Angebot als PDF erzeugen, wird über eigenen Button aufgerufen
    var servicecode =  a.valueof("$comp.SERVICEORDERCODE");
    var pdfpath =  a.valueof("$sys.clienttemp") + "/Serviceauftrag " + servicecode + ".pdf";
    a.globalvar("$global.RptServiceOrderDetails", [servicecode, relid, pdfpath]);
    a.openStaticLinkedReport("RPTJ_SERVICEORDER", false, a.REPORT_EXPORT, [a.REPORT_EXPORT_PDF, pdfpath], params, columnNames, rptdata);
}
else
    {
        a.showMessage("Es sind keine Daten zur Berichtsauswertung vorhanden.");
    }