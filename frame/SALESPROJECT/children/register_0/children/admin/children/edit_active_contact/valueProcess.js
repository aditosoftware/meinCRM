var oppid = a.valueof("$comp.idcolumn");
if (oppid != '')
{
	var x = a.sql("select max(ENTRYDATE) from HISTORY join HISTORYLINK on HISTORYID = HISTORYLINK.HISTORY_ID "
	+ " where MEDIUM in (1,2,8) and OBJECT_ID = 16 and ROW_ID = '" + oppid + "'");
	
	if (x != '')
	{
		var dauer = (a.valueof("$sys.today") - date.dateToLong(date.longToDate(x))) / date.ONE_DAY;	
		dauer = a.formatDouble(eMath.addDec(dauer, 1),"#");
		a.rs(dauer)
	}
	else 
	a.rs(0);
}