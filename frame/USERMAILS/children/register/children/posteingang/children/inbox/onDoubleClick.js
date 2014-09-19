import("lib_emailclient");

var user = a.valueof("$comp.user");
var box = "INBOX"
emails.openMessage(user, a.decodeFirst(a.valueof("$comp." + box)), getPostbox(box), false);
var id = a.decodeFirst(a.valueof("$comp." + box));

a.sqlUpdate("AOSYS_MAILCACHE", ["SEEN"], [SQLTYPES.INTEGER], ["1"], "MAILUSER = '" + user + "' AND MAILID = '" + id + "'");
a.refresh("$comp." + box);