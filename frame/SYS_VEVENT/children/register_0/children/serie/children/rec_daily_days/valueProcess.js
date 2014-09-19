var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var freq = rrule["FREQ"];
    var interval = rrule["INTERVAL"];
    if (freq == "DAILY")
    {
        if (interval != -1)
            a.rs(interval);
        else
            a.showMessage(a.translate("Tägliches Serienmuster konnte nicht bestimmt werden"));
    }
}