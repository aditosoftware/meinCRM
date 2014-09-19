import("lib_calendar");

// Vorbelegung der Filter für TASK und EVENT
var filter = reset_filterToDo()
a.imagevar("$image.FilterValuesT", filter );
a.setValue("$comp.Label_filtertext_task", show_filterToDo(filter));
filter = reset_filterEvent();
a.imagevar("$image.FilterValuesE", filter);
a.setValue("$comp.Label_filtertext_event", show_filterEvent(filter));

// Vorbelegung der CB CallType
a.setValue("$comp.cmb_calltype", "0");

// CalendarCache neu aufbauen
calendar.clearCache();