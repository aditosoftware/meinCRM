import("lib_offerorder")

var ordertype = a.valueof("$comp.ORDERTYPE")
if (ordertype != '')
{
	var text = a.sql("select LONG_TEXT from TEXTBLOCK "
		+ " where AOTYPE = " + getAOType ("Fuss", ordertype) + " and LANG = 1 and SHORTTEXT = 'Standard'");
	a.setValue("$comp.FOOTER", text);
}