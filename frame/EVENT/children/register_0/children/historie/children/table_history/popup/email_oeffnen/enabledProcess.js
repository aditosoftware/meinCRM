var histid = a.decodeFirst(a.valueof("$comp.Table_history"));
a.rs(false);
if (histid != '')
{
	var emailid = a.sql("select MAIL_ID from HISTORY where HISTORYID = '" + histid + "'")
	a.rs (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW && emailid != '')
}