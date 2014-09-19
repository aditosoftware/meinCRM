var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var freq = rrule["FREQ"];
    var bydayMS = rrule["BYDAY"];
    var rValue = "false";
    if (freq == "WEEKLY" && bydayMS != null && bydayMS != "")
    {
        var byday = a.decodeMS(bydayMS);
        for (var i = 0; i < byday.length; i++)
        {
            if (byday[i] == "WE")
            {
                rValue = "true";
                break;
            }
        }
    }

    a.rs(rValue);
}