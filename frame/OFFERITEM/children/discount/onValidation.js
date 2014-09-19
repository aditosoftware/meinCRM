var quantity = a.valueof("$comp.QUANTITY");
if (quantity < 1 || quantity > 499 || quantity == '')
{
    a.setValue("$comp.PRICE", "");
}