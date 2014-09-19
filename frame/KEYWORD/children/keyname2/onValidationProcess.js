//Schlüsselbegriff muss eindeutig sein
if ( a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW || a.valueof("$sys.workingmode") == a.FRAMEMODE_EDIT )
{
	var name = a.valueof("$comp.KEYNAME2");
	var cnt = 0;
	if(name != "")
	{
		cnt = a.sql("select count(*) from keyword where keytype = 0 and UPPER(keyname2) = '" + name.toUpperCase() + "'");
	}

	if(cnt > 0)
	{
	 		a.rs(a.translate("Der Schlüsselbegriff ist bereits vergeben! Bitte verwenden sie einen anderen Schlüsselbegriff."));
	}
}