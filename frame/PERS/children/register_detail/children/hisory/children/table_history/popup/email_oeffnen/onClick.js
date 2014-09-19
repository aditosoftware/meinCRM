var emailid = a.sql("select MAIL_ID from HISTORY where HISTORYID = '" + a.valueof("$comp.Label_history_dec") + "'")
emails.openMail(emailid, false);