var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var freq = rrule["FREQ"];
    if (freq == undefined || freq == "")
        a.rs("Keine")
    else if (freq == "DAILY")
        a.rs("Täglich");
    else if (freq == "WEEKLY")
        a.rs("Wöchentlich");
    else if (freq == "MONTHLY")
        a.rs("Monatlich");
    else if (freq == "YEARLY")
        a.rs("Jährlich");
    else
        a.showMessage(a.translate("Serienmuster konnte nicht ermittelt werden"));
}