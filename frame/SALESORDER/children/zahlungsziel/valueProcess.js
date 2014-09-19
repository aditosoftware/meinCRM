import("lib_keyword")

var zahlbed = a.valueof("$comp.PAYMENTTERMS");
if (zahlbed != '')
{
    var days = a.sql("select keyname2 from keyword where " + getKeyTypeSQL("PAYMENTTERMS") + " and keyvalue = " + zahlbed)
    a.rs(eMath.addInt(a.valueof("$comp.ORDERDATE"), days * date.ONE_DAY))
}