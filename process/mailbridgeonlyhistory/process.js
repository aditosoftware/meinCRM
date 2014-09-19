import("lib_mailbridge");

var sender = a.decodeFirst(a.valueof("$local.sender"));
var recipients = a.decodeMS(a.valueof("$local.recipients"));
var mail = emails.resolveMail(a.valueof("$local.mail"));

MailToHistory( sender, recipients, mail, true );