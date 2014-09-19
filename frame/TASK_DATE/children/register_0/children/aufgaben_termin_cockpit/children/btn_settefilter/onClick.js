import("lib_calendar");

var filter =  "";
if ( a.hasvar("$image.FilterValuesE") )		filter = a.valueofObj("$image.FilterValuesE");
filter = filterEvent(filter);
if ( filter != "")
{
    a.imagevar("$image.FilterValuesE", filter);
    a.setValue("$comp.Label_filtertext_event", show_filterEvent(filter));
    a.refresh("$comp.tbl_Termine");
}