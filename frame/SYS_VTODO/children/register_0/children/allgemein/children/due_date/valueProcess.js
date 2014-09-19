var due = a.valueofObj("$comp.due_date");
if (due == "")
{
    // Initialiseren; danach leer damit man anschliessend
    // das Element auch gelöscht werden kann
    due = a.valueofObj("$image.entry")[calendar.DUE];
    a.valueofObj("$image.entry")[calendar.DUE] = "";

}
var startdate = a.valueofObj("$comp.startdate");
if (startdate != "" && due != "")
{
    if (due < startdate)
    {
        due = startdate;
    }
}

a.rs(due);