import("lib_addr");
import("lib_keyword");
import("lib_sql");
import("lib_report");

var id = a.valueof("$comp.idcolumn");
var rpt = "RPT_SALESORDER";
var sprache = getKeyName(a.valueof("$comp.LANGUAGE"), "SPRACHE", "keyname2");

var relid = a.valueof("$comp.RELATION_ID");
var addrobj = new AddrObject( relid );
var splink = "#" + new FrameData().getData("id", "16", ["title"] ) + ":"  //16=frameid
+ a.sql("select PROJECTNUMBER from SALESPROJECT where SALESPROJECTID = '" + a.valueof("$comp.PROJECT_ID") + "'") + "#";

var stornocode = a.sql("select ORDERCODE, " + getKeySQL("ORDERTYPE", "ORDERTYPE") + " from SALESORDER where SALESORDERID = '" 
    + a.valueof("$comp.SALESORDER_ID") + "'", a.SQL_ROW);
//                                0           1           2           3         4       5        6           7           8
var rptdata = a.sql("select PRODUCTID, PRODUCTCODE, SALESORDERID, CURRENCY, FOOTER, HEADER, ORDERCODE, ORDERDATE, COALESCE(SALESORDER.VAT,0), "
    //                      9                   10              11                  12              13          14                      15
    + "COALESCE(ORDERITEM.DISCOUNT,0), ITEMNAME, ORDERITEM.SALESORDER_ID, COALESCE(PRICE,0), PRODUCT_ID, COALESCE(QUANTITY,0), ORDERITEM.UNIT, "
    //       16                    17               18
    + "ITEMSORT, COALESCE(ORDERITEM.VAT,0), " + getKeySQL("Einheiten", "ORDERITEM.UNIT", sprache )
    + ", 0 as ITEMSUM, ORDERITEM.OPTIONAL " // 19, 20
    + "from PRODUCT "
    + "join ORDERITEM on PRODUCTID = ORDERITEM.PRODUCT_ID "
    + "join SALESORDER on SALESORDERID = ORDERITEM.SALESORDER_ID "
    + "where SALESORDERID = '"+ id +"'", a.SQL_COMPLETE);

var rptfields = ["PRODUCTID", "PRODUCTCODE", "SALESORDERID", "CURRENCY", "FOOTER", "HEADER", "ORDERCODE", "ORDERDATE", "SALESORDER.VAT", 
"ORDERITEM.DISCOUNT", "ITEMNAME", "ORDERITEM.SALESORDER_ID", "PRICE", "PRODUCT_ID", "QUANTITY", "ORDERITEM.UNIT", "ITEMSORT", "ORDERITEM.VAT", 
"UNITTEXT", "ITEMSUM", "OPTIONAL"];

var preisMenge= 0;
var itemSum = 0;
var sumItemSum = 0;
var total = 0;
var sums = new Array();
var vatsum = 0;

for(var i = 0; i < rptdata.length; i++)
{                
    //Berechnungen durchführen:
    preisMenge = eMath.mulDec(parseFloat(rptdata[i][14]), parseFloat(rptdata[i][12]) );
    itemSum = eMath.roundDec(eMath.divDec(eMath.mulDec(preisMenge, eMath.subDec(100, rptdata[i][9]) ), 100), 2, eMath.ROUND_HALF_EVEN); //Summe je Artikel
    rptdata[i][19] = a.formatDouble(itemSum, "#,##0.00"); //Immer zwei Nachkommastellen und ',' stat '.'  
    sumItemSum += itemSum; //Gesamtsumme aller Artikel      
    vatsum = (eMath.divDec(eMath.mulDec(itemSum, rptdata[i][17] ), 100)); //Steuerbetrag in Euro je Artikel
    if(rptdata[i][17] > 0) sums.push([rptdata[i][17], vatsum]); //MWSteuerwerte für Map vorbereiten nur wenn MwSt größer 0!
    total = eMath.addDec(sumItemSum, rptdata[i][8]); //Gesamtsumme abzügl. MwSt.
    total = a.formatDouble(total, "#,##0.00")
    rptdata[i][7] = date.longToDate(rptdata[i][7], "dd.MM.yyyy"); //Datum formatieren
    //Zahlen formatieren:
    rptdata[i][9] = a.formatDouble(rptdata[i][9], "#,##0.00");
    rptdata[i][12] = a.formatDouble(rptdata[i][12], "#,##0.00");
    rptdata[i][14] = a.formatDouble(rptdata[i][14], "#,##0");
    rptdata[i][17] = a.formatDouble(rptdata[i][17], "#,##0.00");                   
        
}

var subdata = getSubReportMap(["VAT","WERT"], sums);
 
var params = new Array;
params["myAddr"] = a.sql("select ICON_TYPE from asys_ICONS where description = 'Firmenlogo'");
params["adito.image.myLogo"] = "base64:" + a.sql("select BINDATA from asys_ICONS where description = 'Firmenlogo'");
params["Artikelbezeichnung"] = a.translate("Artikelbezeichnung", sprache);
params["Artikel-Nr"] = a.translate("Artikel-Nr", sprache);
params["Einzelpreis"] = a.translate("Einzelpreis", sprache);
params["Menge"] = a.translate("Menge", sprache);
params["MWST"] = a.translate("UmSt", sprache);
params["zzgl."] =  a.translate("zzgl.", sprache);
params["Belegtyp"] = getKeyName(a.valueof("$comp.ORDERTYPE"), "ORDERTYPE", "keyname1", sprache);
params["Datum"] = 	a.translate("Datum", sprache);
params["Nummer"] = a.translate("Nummer", sprache);
params["Zahlungsbedingung"] = a.translate("Zahlungsbedingung", sprache);
params["Lieferbedingung"] = a.translate("Lieferbedingung", sprache);
params["Rabatt"] = a.translate("Rabatt", sprache);
params["Gesamt"] =  a.translate("Gesamt", sprache);
params["Summe"] = 	a.translate("Summe", sprache);
params["zzglUMST"] = 	a.translate("zzgl. Summe UmSt", sprache);
params["ADRESSE"] = a.valueof("$comp.ADDRESS_INVOICE"); //addrobj.getFormattedAddress();
params["PERSON"] = addrobj.formatAddress("{ls},");
params["ZAHLBED"] = getKeyName(a.valueof("$comp.PAYMENTTERMS") , "PAYMENTTERMS", "KEYNAME1", sprache);
params["LIEFBED"] = getKeyName(a.valueof("$comp.DELIVERYTERMS") , "DELIVERYTERMS", "KEYNAME1", sprache);
params["Stornotext"] = a.translate("Die %0 Nr %1 wird hiermit storniert", [stornocode[1], stornocode[0]]);
params["SUMITEMSUM"] = sumItemSum;
params["adito.datasource.subdata"] = subdata;
params["TOTAL"] = total;

a.openStaticLinkedReport("RPTJ_SALESORDER", false, a.REPORT_OPEN, null, params, rptfields, rptdata)

// Beleg als PDF erzeugen, wird über eigenen Button aufgerufen
var ordercode =  a.valueof("$comp.ORDERCODE");
var pdfpath =  a.valueof("$sys.clienttemp") + "/" + a.translate("Beleg", sprache) + " " + ordercode + ".pdf";
var ordertype = getKeyName(a.valueof("$comp.ORDERTYPE"), "ORDERTYPE", "KEYNAME1", sprache);
var formula = "Email_" + getKeyName(a.valueof("$comp.ORDERTYPE"), "ORDERTYPE");
a.globalvar("$global.RptOfferOrderDetails", [ordercode, relid, pdfpath, ordertype, formula, "AGB", splink]);

a.openStaticLinkedReport("RPTJ_SALESORDER", false, a.REPORT_EXPORT,  [a.REPORT_EXPORT_PDF, pdfpath], params, rptfields, rptdata)