var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var freq = rrule["FREQ"];
    var bymonth = rrule["BYMONTH"];
    if (freq == "YEARLY" && (a.valueofObj("$comp.rec_yearly") == "Jeden # #"))
    {
        if (bymonth != null)
        {
            var bmd = a.decodeMS(bymonth);
            var val = "";
            for (var i = 0; i < bmd.length; i++)
            {
                val += bmd[i];
                if (i < bmd.length - 1)
                    val += ",";
            }
            a.rs(val);
        }
        else
            a.rs("1");
    }
}