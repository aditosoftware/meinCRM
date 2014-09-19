if(a.valueof("$sys.superframe") != "")
{
	tblid = a.valueof("$image.ID");
	if(tblid != "")
	{
		var modul = a.sql("select aomodule from aosys_tablerepository where tableid = '" + tblid + "'");
		if(modul == "99") a.rs("Y"); else a.rs("N");
	}
	else
	{
		a.rs("N");
	}
}
else
{
	a.rs("N");
}