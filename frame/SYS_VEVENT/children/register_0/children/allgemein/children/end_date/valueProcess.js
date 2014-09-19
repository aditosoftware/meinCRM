//a.rs(a.valueofObj("$image.entry")[calendar.DTEND]);

// Diese Formel sorgt dafür, dass das Enddatum nie kleiner
// als das Startdatum ist. Existiert kein Startdatum, wird
// keine Berechnung durchgeführt.
// @author RL, 09.03.2005

// der aktuelle Inhalt
var content = a.valueofObj("$comp.end_date");

// Initialisierungswert
if (content == "" || content == undefined)
    content = a.valueofObj("$image.entry")[calendar.DTEND];

var start = a.valueofObj("$comp.start_date");
if (start != "")
{
    a.rs(start <= content ? content : eMath.addDec(start, a.ONE_HOUR));
}
else
{
    a.rs(content);
}