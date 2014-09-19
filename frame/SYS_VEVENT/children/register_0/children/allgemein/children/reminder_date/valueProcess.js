// Formel sorgt dafür, dass IMMER ein Reminderdate eingetragen ist
// wenn nötig
// @author RL, 01.09.2005

// der aktuelle Inhalt
var content = a.valueofObj("$comp.reminder_date");

// Initialisierungswert
if (content == "" || content == undefined)
    content = a.valueofObj("$image.entry")[calendar.REMINDER_DATE];

// Mindestwert
if (a.valueofObj("$comp.hasreminder") == "true" && (content == "" || content == undefined))
    content = a.valueofObj("$comp.start_date");

// Minimalwert
if (content <= a.valueofObj("$sys.date"))
{
    content = "";
}

a.rs(content);