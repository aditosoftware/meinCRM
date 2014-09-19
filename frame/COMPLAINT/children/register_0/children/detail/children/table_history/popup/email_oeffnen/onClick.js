var hid = a.decodeFirst(a.valueof("$comp.Table_history"))

var emailid = a.sql("select MAIL_ID from HISTORY where HISTORYID = '" + hid + "'")
emails.openMail(emailid, false);