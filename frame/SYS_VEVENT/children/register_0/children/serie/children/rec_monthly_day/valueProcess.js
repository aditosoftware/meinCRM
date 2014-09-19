var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
  var rrule = calendar.getRuleAsMap(rruleStr[0]);

	var freq = rrule["FREQ"];
	var bymonthday = rrule["BYMONTHDAY"];
	if (freq == "MONTHLY" && (a.valueofObj("$comp.rec_month") == "Am #. jedes #. Monat"))
	{
		if (bymonthday != null)
		{
			var bmd = a.decodeMS(bymonthday);
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