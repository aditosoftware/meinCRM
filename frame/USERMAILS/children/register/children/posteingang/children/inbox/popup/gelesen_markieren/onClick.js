var user = a.valueof("$comp.user");
var ids = a.decodeMS(a.valueof("$comp.INBOX"));

for (i = 0; i < ids.length; i++)
{
 a.sqlUpdate("AOSYS_MAILCACHE", ["SEEN"], [SQLTYPES.INTEGER], [1], "MAILUSER = '" + user + "' AND MAILID = '" + ids[i] + "'");
}
a.refresh("$comp.INBOX");