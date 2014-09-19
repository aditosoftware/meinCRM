var histdec = a.decodeFirst(a.valueof("$comp.Table_history"));
if (histdec != '')
{
    var emailid = a.sql("select MAIL_ID from HISTORY where HISTORYID = '" + histdec + "'")
    a.rs (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW && emailid != '')
}