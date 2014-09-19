var net = a.valueof("$comp.NET");
var vat = a.valueof("$comp.SUMME_UMST")

if( net != '' && vat != '')
{
    a.rs( eMath.addDec(net, vat) ); 
}
else a.rs(0)