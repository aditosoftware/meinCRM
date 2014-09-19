import("lib_keyword")

var ordertype = a.valueof("$comp.ORDERTYPE");
if (ordertype != '')
{
    var ft = a.sql("select keyname1 from keyword where keyvalue = " + ordertype + " and " + getKeyTypeSQL("ORDERTYPE"));
    var diff = eMath.addDec(a.valueof("$comp.SUMME_brutto"), -a.valueof("$comp.PAYED"))

    a.rs(a.valueof("$comp.ADJUSTMENT") == 'N' && (ft == 'Rechnung' || ft == 'Gutschrift') && diff != 0)
}