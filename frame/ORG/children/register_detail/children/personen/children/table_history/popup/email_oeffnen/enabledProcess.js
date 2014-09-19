var histdec = a.valueof("$comp.Label_history_dec");
var emailid = "";
if (histdec != "")	emailid = a.sql("select MAIL_ID from HISTORY where HISTORYID = '" + histdec + "'")
a.rs (a.valueof("$sys.workingmode") == a.FRAMEMODE_SHOW && emailid != "" )