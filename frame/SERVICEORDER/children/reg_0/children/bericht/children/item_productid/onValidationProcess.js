import("lib_offerorder");
import("lib_keyword");

var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];
if (tableid != '')
{
    var relorgid = a.valueof("$comp.RELATION_ID");
    var pricelist = 1;// Standardpreisliste
    var productid = a.valueof("$comp.item_productid");
    var currency = "EUR"; // nur gültig für Eurozone
    if (pricevalidation(productid, currency)[0] == undefined) a.showMessage(a.translate("Preiseliste ungültig !"))
    else
    {
        var quantity = tabledata[5]; 
        if (quantity == "") quantity = 1;
        var lang = 1; // Sprache für Service ist Deutsch
        var prod = a.sql("select PRODUCTCODE, PRODUCTNAME, UNIT, " + getKeySQL("Einheiten", "UNIT") + ", LONG_TEXT "
            + " from PRODUCT left join TEXTBLOCK on (TEXTBLOCK.TABLENAME =  'PRODUCT' and LANG = " + lang + " and ROW_ID = '" + productid + "')"
            + " where PRODUCTID = '" + productid + "'", a.SQL_ROW);
        if ( productid != "" && currency != "" && quantity != "")
        {
            var list = getPrice( productid, currency, pricelist, quantity);

            a.updateTableCell("$comp.Table_Items", tableid, 4 , prod[0], prod[0]);
            a.updateTableCell("$comp.Table_Items", tableid, 5 , quantity, a.formatDouble(1, "#0"));
            a.updateTableCell("$comp.Table_Items", tableid, 6 , prod[2], prod[3]);
            a.updateTableCell("$comp.Table_Items", tableid, 7 , list[1], a.formatDouble(list[1], "#,##0.00"));
            a.updateTableCell("$comp.Table_Items", tableid, 8 , 0, a.formatDouble(0, "#,##0.00 '%'"));
            a.updateTableCell("$comp.Table_Items", tableid, 9 , list[1], a.formatDouble(list[1], "#,##0.00"));
            a.updateTableCell("$comp.Table_Items", tableid, 10 , list[3], a.formatDouble(list[3], "#,##0.00 '%'"));
        }
    }
}