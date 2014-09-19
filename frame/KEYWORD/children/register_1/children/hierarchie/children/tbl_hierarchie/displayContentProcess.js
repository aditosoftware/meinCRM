import("lib_keyword");
var keyvalue = a.valueof("$comp.keyvalue");

var list = []
if (keyvalue != "")
{
	var list = a.sql("select KEYWORDID, KEYVALUE, AOACTIVE, KEYNAME1, KEYNAME2, "
		+ " KEYDETAIL, KEYDESCRIPTION "
		+ " from KEYWORD where KEYTYPE = " + keyvalue + " order by KEYSORT", a.SQL_COMPLETE);

	for(var i=0; i<list.length; i++)
	{
		list[i][3] = a.translate(list[i][3]);
		list[i][4] = a.translate(list[i][4]);
	}
}
if (list == '') list = a.createEmptyTable(7)
a.ro(list);