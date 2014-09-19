import("lib_offerorder");

var ordertype = a.valueof("$comp.ORDERTYPE")
if (ordertype != '')
{
    var aotype = getAOType ("Fuss", ordertype);
    if (aotype != '')
    {
        var text = a.sql("select LONG_TEXT from TEXTBLOCK where SHORTTEXT = '" + a.valueof("$comp.FOOTER_SHORT") 
            + "' and AOTYPE = " + aotype + " and LANG = "	+ a.valueof("$comp.LANGUAGE"));
        a.setValue("$comp.FOOTER", text)
    }
}