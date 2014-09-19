import("lib_offerorder");

var relorgid = a.valueof("$comp.relorgid");
var productid = a.valueof("$comp.PRODUCT_ID");
var currency = a.valueof("$comp.currency");
var quantity = a.valueof("$comp.QUANTITY");
var pricelist = GetAttributeKey( "Preisliste", 1, relorgid )[0];
if ( pricelist == undefined) pricelist = 1; // Standardpreisliste

if ( productid != "" && currency != "" && quantity != "")
{
    var list = getPrice( productid, currency, pricelist, quantity);
    a.setValue("$comp.Pricelist", "Preisliste: " + list[2])
    a.setValue("$comp.PRICE", list[1])
}