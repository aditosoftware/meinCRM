var wm = a.valueofObj("$sys.workingmode");
var editmode = (wm == a.FRAMEMODE_NEW ? calendar.MODE_INSERT : calendar.MODE_UPDATE);
if (editmode == calendar.MODE_INSERT)
{
    a.rs("false");
}
else
{
    a.rs("true");
}