var message = "";

var current = Number(a.valueofObj("$sys.staticdate")) - Number(a.ONE_MINUTE * 5);

var start = a.valueofObj("$comp.start_date");
if (start == "")
    start = null;

var end = a.valueofObj("$comp.end_date");
if (end == "")
    end = null;
 
if (start != null && start < current)
    message = a.translate("Startdatum liegt in der Vergangenheit. ");

if (end != null && end < current)
    message = a.translate("Enddatum liegt in der Vergangenheit. ");

var hasReminder = a.valueofObj("$comp.hasreminder");

var rDate = a.valueofObj("$comp.reminder_date");
if (rDate == "")
    rDate = null;

var rDuration = a.valueofObj("$comp.reminder_duration");
if (rDuration == "")
    rDuration = null;

if (hasReminder == "true")
{
    if (rDate == null && rDuration == null)
    {														
        message += a.translate("Kein Erinnerungsdatum angegeben.");
    } 
    else if ((rDate != null && rDate < current) || (rDuration != null && start != null && Number(start) + Number(rDuration) < current))  // Duration ist negativ
    {
        message += a.translate("Erinnerungsdatum liegt in der Vergangenheit.");
    }	
}
 

a.rs(message);