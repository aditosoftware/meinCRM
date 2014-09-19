import("lib_emailclient");

var user = a.valueof("$comp.user");
var box = "OUTBOX";
emails.openMessage(user, a.decodeFirst(a.valueof("$comp." + box)), getPostbox(box), false);