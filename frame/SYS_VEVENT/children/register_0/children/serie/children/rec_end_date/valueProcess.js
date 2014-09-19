var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var until = rrule["UNTIL"];

    if (until == undefined || until == null)
    {
        a.rs("");
    }
    else
    {
        a.rs(until);
    }
}