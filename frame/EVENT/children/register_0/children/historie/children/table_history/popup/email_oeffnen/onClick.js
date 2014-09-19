var histid = a.decodeFirst(a.valueof("$comp.Table_history"))

var emailid = a.sql("select MAIL_ID from HISTORY where HISTORYID = '" + histid + "'")
emails.openMail(emailid, false);