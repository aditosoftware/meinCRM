import("lib_calendaruser");
import("lib_linkedFrame");

// Fremde Kalenderbenutzer aktualisieren
var user = a.valueof("$comp.login");

var currentUsers = a.decodeMS(a.valueof("$comp.calendar_read_other"));
updateCalendarUser(user, "calendar_read", currentUsers);

currentUsers = a.decodeMS(a.valueof("$comp.calendar_write_other"));
updateCalendarUser(user, "calendar_write", currentUsers);

// Schliessen, Speichern, Aktualisieren von Superframe
swreturn();