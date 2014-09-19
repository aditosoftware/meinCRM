import("lib_emailclient");

var user = a.valueof("$comp.user");
var box = "DELBOX";
emails.openMessage(user, a.decodeFirst(a.valueof("$comp." + box)), getPostbox(box), false);