import("lib_history")

var event = a.valueofObj("$image.entry");
if ( event[calendar.STATUS] == calendar.STATUS_COMPLETED )
{
    makeTaskDone( [ event[calendar.ID] ]);
}

if ( a.hasvar("$image.refresh") )
{
    a.refresh(a.valueof("$image.refresh"), a.valueof("$image.window"), a.valueof("$image.image"));
}

if (a.valueof("$image.closecurrentframe") == "true")
{
    a.closeCurrentTopImage();
}