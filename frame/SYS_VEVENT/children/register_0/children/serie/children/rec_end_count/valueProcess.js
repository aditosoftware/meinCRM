var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var count = rrule["COUNT"];
    if (count == -1 || count == undefined)
    {
        a.rs("");
    }
    else
    {
        a.rs(count);
    }
}