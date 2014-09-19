import("lib_offerorder")

var ordertype = a.valueof("$comp.ORDERTYPE")
if (ordertype == 2) // nur bei Rechnung
{
	var text = a.sql("select LONG_TEXT from TEXTBLOCK "
		+ " where AOTYPE = " + getAOType ("Mahntext", ordertype) + " and LANG = 1 and SHORTTEXT = 'Standard'");
	a.setValue("$comp.REMINDERTEXT", text);
}