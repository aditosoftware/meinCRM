var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var freq = rrule["FREQ"];
    var byday = rrule["BYDAY"];
    var bymonthday = rrule["BYMONTHDAY"];
    if (freq == "MONTHLY")
    {
        if (bymonthday != null && byday == null)
            a.rs("Am #. jedes #. Monat");
        else if (bymonthday == null && byday != null)
            a.rs("Am #. # jeden #. Monat");
        else
            a.showMessage(a.translate("Monatliches Serienmuster konnte nicht bestimmt werden"));
    }
}