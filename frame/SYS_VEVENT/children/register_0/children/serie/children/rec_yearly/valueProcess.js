var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var freq = rrule["FREQ"];
    var byday = rrule["BYDAY"];
    var bymonthday = rrule["BYMONTHDAY"];
    if (freq == "YEARLY")
    {
        if (bymonthday != null && byday == null)
            a.rs("Jeden # #");
        else if (bymonthday == null && byday != null)
            a.rs("Am #. # im #");
        else
            a.showMessage(a.translate("Jährliches Serienmuster konnte nicht bestimmt werden"));
    }
}