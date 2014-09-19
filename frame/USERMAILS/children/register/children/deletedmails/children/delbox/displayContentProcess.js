import("lib_emailclient")

var user = a.valueof("$comp.user");

if (user != null && user.length > 0)
{
    a.rq("SELECT MAILID, ATTACHMENTS, SUBJECT, PARTNER, SENTDATE FROM AOSYS_MAILCACHE WHERE MAILUSER = '" 
        + user + "' AND POSTBOX = '" +  getPostbox( "DELBOX" ) + "' ORDER BY SENTDATE DESC" );
}
else
{
    a.rq(a.EMPTY_TABLE_SQL);
}