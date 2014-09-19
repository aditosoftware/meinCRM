var quant = Number(a.valueof("$comp.QUANTITY"));
var price = Number(a.valueof("$comp.PRICE"));
var discount = Number(a.valueof("$comp.DISCOUNT"));

if (quant != '' && price != '')
    a.rs(quant * price * (100 - discount) / 100);