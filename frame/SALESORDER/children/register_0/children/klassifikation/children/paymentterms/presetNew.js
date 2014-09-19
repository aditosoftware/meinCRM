if ( a.hasvar("$image.paymentterms"))
{
    var terms = a.valueof("$image.paymentterms");
    if ( terms != undefined) a.rs(terms);
}
else a.rs(1);