var ids = a.decodeMS(a.valueof("$comp.unlinked_mails"));
if ( a.askQuestion( ids.length + " " + a.translate("E-Mails löschen ?"), a.QUESTION_YESNO, "") == "true" )
{
    a.sqlDelete("ASYS_MAILREPOSIT", "ID IN ( '" +  ids.join("', '") + "' )");
    a.sqlDelete("UNLINKEDMAIL", "MAILID IN ( '" +  ids.join("', '") + "' )");
    a.refresh();
}