var rruleStr = a.valueofObj("$image.entry")[calendar.RRULE];
if (rruleStr != undefined)
{
    var rrule = calendar.getRuleAsMap(rruleStr[0]);

    var count = rrule["COUNT"];
    var until = rrule["UNTIL"];

    if ((count == -1 || count == undefined) && until == null)
    {
        a.rs("Kein Enddatum");
    }
    else if (count != -1 && until == null)
    {
        a.rs("Endet nach Anzahl Terminen");
    }
    else if (count == -1 && until != null)
    {
        a.rs("Endet am");
    }
    else
    {
        a.showMessage(a.translate("Enddatum konnte nicht bestimmt werden."));
    }
}