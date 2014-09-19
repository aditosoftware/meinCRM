var editmode = a.valueof("$image.editmode")

if (editmode == calendar.MODE_INSERT)
{
// Nichts zu tun
}
else if (editmode == calendar.MODE_UPDATE)
{
    try
    {
        calendar.remove(a.valueofObj("$image.entry")[calendar.ID]);
    }
    catch (ex)
    {
        log.log(ex);
    //a.showMessage("Der Termin konnte nicht gelöscht werden.");
    }
}
else
{
    a.showMessage(a.translate("Ungültiger Modus des Frames. Wenden Sie sich an Ihren Administrator"));
}