var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var freq = rrule["FREQ"];
    var interval = rrule["INTERVAL"];
    if (freq == "MONTHLY" && (a.valueofObj("$comp.rec_month") == "Am #. # jeden #. Monat"))
    {
        if (interval == -1)
            a.rs(1);
        else
            a.rs(interval);
    }
}