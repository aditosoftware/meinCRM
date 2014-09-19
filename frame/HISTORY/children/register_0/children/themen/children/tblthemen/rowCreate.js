import("lib_tablecomp");
import("lib_calendar");
import("lib_keyword");

var row = a.valueofObj("$local.rowdata")
var fields = [
[1,"THEME_ID"],
[2,"THEME"]
];
var vkfields = [[a.valueof("$comp.idcolumn"), "HISTORY_ID"]];
var insanz = instable(fields, vkfields, row, "HISTORY_THEME", "HISTORY_THEMEID");
// Für Remeinder die IDS merken
if ( ! a.hasvar("$image.pHistoryThemeIDs") ) pHistoryThemeIDs = [];
else    pHistoryThemeIDs = a.valueofObj("$image.pHistoryThemeIDs");
a.imagevar("$image.pHistoryThemeIDs", pHistoryThemeIDs.concat(row[0]));
