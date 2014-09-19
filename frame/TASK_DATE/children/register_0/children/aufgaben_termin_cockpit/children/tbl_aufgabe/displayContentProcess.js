import("lib_calendar");

var filter = {};
if ( a.hasvar("$image.FilterValuesT") )	filter = a.valueofObj("$image.FilterValuesT");
a.ro(getTodos( filter ));