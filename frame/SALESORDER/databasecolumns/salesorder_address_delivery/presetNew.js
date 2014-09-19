import("lib_addr");
import("lib_offerorder");

if ( a.hasvar("$image.ID") )
{
    a.rs(getOrderAddress( a.valueof("$image.ID"), "Lieferadresse" ));
}
