import("lib_calendar");

var filter = reset_filterEvent();
a.imagevar("$image.FilterValuesE", filter);
a.setValue("$comp.Label_filtertext_event", show_filterEvent(filter));
a.refresh("$comp.tbl_Termine");