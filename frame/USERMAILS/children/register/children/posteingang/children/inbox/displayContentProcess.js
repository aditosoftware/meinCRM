import("lib_emailclient")

var user = a.valueof("$comp.user");

if (user != null && user.length > 0)
{
    a.rq("SELECT MAILID, CASE WHEN SEEN = 0 THEN -16776961 ELSE CASE WHEN STORED = 1 THEN -6710887 ELSE 0 END END, "
        + " ATTACHMENTS, SUBJECT, PARTNER, SENTDATE FROM AOSYS_MAILCACHE WHERE MAILUSER = '" 
        + user + "' AND POSTBOX = '" +  getPostbox( "INBOX" ) + "' ORDER BY SENTDATE DESC" );
}
else
{
    a.rq(a.EMPTY_TABLE_SQL);
}