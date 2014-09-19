import("lib_offerorder")

var ordertype = a.valueof("$comp.ORDERTYPE");
var language = a.valueof("$comp.LANGUAGE");
if (ordertype != '' && language != '')
{
    var aotype = getAOType ("Kopf", ordertype);
    if (aotype != '')
        a.translate(a.rq("select SHORTTEXT from TEXTBLOCK "
            + " where AOTYPE = " + aotype + " and LANG = "	+ language
            + " order by SHORTTEXT"));
}