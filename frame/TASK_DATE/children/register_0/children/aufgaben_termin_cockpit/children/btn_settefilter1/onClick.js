import("lib_calendar");

var filter =  "";
if ( a.hasvar("$image.FilterValuesT") )		filter = a.valueofObj("$image.FilterValuesT");
filter = filterToDo(filter);
if ( filter != "")
{
    a.imagevar("$image.FilterValuesT", filter );
    a.setValue("$comp.Label_filtertext_task", show_filterToDo(filter));
    a.refresh("$comp.tbl_Aufgabe");
}