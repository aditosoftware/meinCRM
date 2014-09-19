import("lib_emailclient");

var user = a.valueof("$sys.user");

// Aktualisieren
updateMessages(user, "INBOX");
updateMessages(user, "OUTBOX");
updateMessages(user, "DELBOX");