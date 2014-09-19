import("lib_calendar");

var filter = {};
if ( a.hasvar("$image.FilterValuesE") )	filter = a.valueofObj("$image.FilterValuesE");
a.ro(getEvents( filter ));