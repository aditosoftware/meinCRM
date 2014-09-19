// Formel sorgt dafür, dass IMMER ein Reminderdate eingetragen ist
// wenn nötig
// @author RL, 10.05.2006

// der aktuelle Inhalt
var content = a.valueofObj("$comp.reminder_duration");

// Initialisierungswert
if (content == "" || content == undefined)
    content = a.valueofObj("$image.entry")[calendar.REMINDER_DURATION];

// Startwert
if (a.valueofObj("$comp.hasreminder") == "true" && (content == "" || content == undefined))
    content = "-900000"; // 15 Minuten

a.rs(content);