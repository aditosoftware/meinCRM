import("lib_offerorder");

var relorgid = a.valueof("$comp.relorgid");
var productid = a.valueof("$comp.PRODUCT_ID");
var currency = a.valueof("$comp.currency");
var quantity = a.valueof("$comp.QUANTITY");
var pricelist = GetAttributeKey( "Preisliste", 1, relorgid )[0];
if ( pricelist == undefined) pricelist = 1;// Standardpreisliste

if ( productid != "")
{
    var prod = a.sql("select GROUPCODEID, KEYNAME1, UNIT from PRODUCT join KEYWORD on GROUPCODEID = KEYVALUE and KEYTYPE = "
        + "(select KEYVALUE from KEYWORD where KEYNAME2 = 'GroupCode' and KEYTYPE = 0) and PRODUCTID = '" + productid + "'", a.SQL_ROW);
    if ( prod.length > 0)
    {    
        a.setValue("$comp.GROUPCODEID", prod[0]);
        a.setValue("$comp.Warengruppe", prod[1]);        
        a.setValue("$comp.UNIT", prod[2]);        
        var lang = getKeyName(a.valueof("$comp.edt_language"), "SPRACHE", "KEYNAME2");
        a.setValue("$comp.UNITTEXT", getKeyName(prod[2], "Einheiten", "KEYNAME1", lang));                
    }
    if (currency != "" && quantity != "")
    {
        var list = getPrice( productid, currency, pricelist, quantity);
        a.setValue("$comp.UMST", list[3]);
        a.setValue("$comp.Pricelist", list[2]);
        a.setValue("$comp.PRICE", list[1]);
    }
}

