if ( a.hasvar("$image.deliveryterms"))
{
    var terms = a.valueof("$image.deliveryterms");
    if ( terms != undefined) a.rs(terms);
}
else a.rs(1);