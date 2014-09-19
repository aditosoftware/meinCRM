var pid = a.valueof("$comp.PRODUCT_ID");
var offerid = a.valueof("$comp.OFFER_ID");
var language = a.valueof("$comp.edt_language")

if(a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW && pid != '' && offerid != '' && language != '')
{
	a.rq("select LONG_TEXT from TEXTBLOCK where AOTYPE = 1 and TABLENAME = 'PRODUCT' and ROW_ID = '" 
		+ pid	+ "' and LANG = " + language);
}