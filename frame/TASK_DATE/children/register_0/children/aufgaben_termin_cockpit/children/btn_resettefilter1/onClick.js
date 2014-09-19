import("lib_calendar");

var filter = reset_filterToDo();
a.imagevar("$image.FilterValuesT", filter);
a.setValue("$comp.Label_filtertext_task", show_filterToDo(filter));
a.refresh("$comp.tbl_Aufgabe");