import("lib_offerorder");
import("lib_keyword");

var tableid = a.decodeFirst(a.valueof("$comp.Table_Items"));
var tabledata = a.getTableData("$comp.Table_Items", [tableid])[0];
if (tableid != '')
{
    var relorgid = a.valueof("$comp.relorgid");
    var pricelist = GetAttributeKey( "Preisliste", 1, relorgid )[0];
    if ( pricelist == undefined) pricelist = 1;// Standardpreisliste
    var productid = a.valueof("$comp.PRODUCT_ID");
    var currency = a.valueof("$comp.CURRENCY");
    
    if (pricevalidation(productid, currency)[0] == undefined) a.showMessage(a.translate("Preiseliste ungültig !"))
    else
    {
        var quantity = 1;
        var lang = a.valueof("$comp.LANGUAGE");
        keylang = getKeyName(lang, "SPRACHE", "keyname2");
        if (lang == '') lang = 1;
        var prod = a.sql("select "+ concat(["PRODUCTCODE","'/'", "PRODUCTNAME"]) + ", UNIT, " + getKeySQL("Einheiten", "UNIT", keylang) + ", LONG_TEXT "
            + " from PRODUCT left join TEXTBLOCK on (TEXTBLOCK.TABLENAME =  'PRODUCT' and LANG = " + lang + " and ROW_ID = '" + productid + "')"
            + " where PRODUCTID = '" + productid + "'", a.SQL_ROW);
        
        if ( productid != "" && currency != "" && quantity != "")
        {
            var list = getPrice( productid, currency, pricelist, quantity );
            
            a.updateTableCell("$comp.Table_Items", tableid, 2 , productid, prod[0]); //Produktname
            a.updateTableCell("$comp.Table_Items", tableid, 3 , quantity, a.formatDouble(quantity, "#0")); //Menge
            a.updateTableCell("$comp.Table_Items", tableid, 4 , prod[1], prod[2]); //Einheit
            a.updateTableCell("$comp.Table_Items", tableid, 5 , list[1], a.formatDouble(list[1], "#,##0.00")); //Einzelpreis
            a.updateTableCell("$comp.Table_Items", tableid, 6 , 0, a.formatDouble(0, "#,##0.00 '%'")); //Rabatt
            a.updateTableCell("$comp.Table_Items", tableid, 7 , list[1], a.formatDouble(list[1], "#,##0.00")); //Summe
            a.updateTableCell("$comp.Table_Items", tableid, 8 , list[3], a.formatDouble(list[3], "#,##0.00 '%'")); //Umst
            a.updateTableCell("$comp.Table_Items", tableid, 9 , prod[3], prod[3]); //Beschreibung
        }
    }
}