var emailid = a.sql("select MAIL_ID from HISTORY where HISTORYID = '" + a.decodeFirst(a.valueof("$comp.Table_history")) + "'")
emails.openMail(emailid, false);