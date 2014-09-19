import("lib_offerorder");

var ordertype = a.valueof("$comp.ORDERTYPE")
if (ordertype != '')
{
    var aotype = getAOType ("Kopf", ordertype);
    if (aotype != '')
    {
        var text = a.sql("select LONG_TEXT from TEXTBLOCK where SHORTTEXT = '" + a.valueof("$comp.HEADER_SHORT") 
            + "' and AOTYPE = " + aotype + " and LANG = "	+ a.valueof("$comp.LANGUAGE"));
        a.setValue("$comp.HEADER", text)
    }
}