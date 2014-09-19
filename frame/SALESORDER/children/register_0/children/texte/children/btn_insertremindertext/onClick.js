import("lib_offerorder");

var ordertype = a.valueof("$comp.ORDERTYPE")
if (ordertype == 2) // nur bei Rechnung
{
    var aotype = getAOType ("Mahntext", ordertype);
    if (aotype != '')
    {
        var text = a.sql("select LONG_TEXT from TEXTBLOCK where SHORTTEXT = '" + a.valueof("$comp.REMINDERTEXT_SHORT") 
            + "' and AOTYPE = " + aotype + " and LANG = "	+ a.valueof("$comp.LANGUAGE"));
        a.setValue("$comp.REMINDERTEXT", text)
    }
}