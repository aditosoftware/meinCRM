import("lib_calendaruser");

try
{
    tools.deleteUser(a.valueof("$comp.login"));	
}
catch(ex)
{
    log.log(ex);
}

// Fremde Kalenderbenutzer aktualisieren
var user = a.valueof("$comp.login");
updateCalendarUser(user, "calendar_read", new Array());
updateCalendarUser(user, "calendar_write", new Array());