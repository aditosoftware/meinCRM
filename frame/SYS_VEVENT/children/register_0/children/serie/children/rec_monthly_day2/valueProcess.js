var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var freq = rrule["FREQ"];
    var byday = rrule["BYDAY"];
    if (freq == "MONTHLY" && (a.valueofObj("$comp.rec_month") == "Am #. # jeden #. Monat"))
    {
        if (byday != null)
        {
            var dec = a.decodeMS(byday)[0];
            a.rs(dec.substring(0, dec.length - 2));
        }
        else
        {
            a.rs("1");
        }
    }
}