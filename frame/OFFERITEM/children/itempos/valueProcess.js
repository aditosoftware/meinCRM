var oid = a.valueof("$comp.OFFER_ID");

if (oid != '' && a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW)
{
	var pos = a.sql("select MAX(cast(ITEMPOSITION as integer)) + 1 from OFFERITEM where OFFER_ID = '" + oid + "' and ASSIGNEDTO is null");

	if (pos != "")	a.rs(pos);
	else	a.rs("1");
}