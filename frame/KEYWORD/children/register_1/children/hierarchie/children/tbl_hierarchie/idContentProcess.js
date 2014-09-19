var keyvalue = a.valueof("$comp.keyvalue");

var list = []
if (keyvalue != "")
{
	var list = a.sql("select KEYWORDID, KEYVALUE, AOACTIVE, KEYNAME1, KEYNAME2, "
		+ " KEYDETAIL, KEYDESCRIPTION "
		+ " from KEYWORD where KEYTYPE = " + keyvalue + " order by KEYSORT", a.SQL_COMPLETE);
}
if (list == '') list = a.createEmptyTable(7)
a.ro(list);