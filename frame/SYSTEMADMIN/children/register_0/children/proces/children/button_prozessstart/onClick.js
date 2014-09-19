var cols = ["TIMERSTATE"];
var types = a.getColumnTypes("AOSYS_TIMER", cols);
var vals = ["1"];
a.sqlUpdate("AOSYS_TIMER", cols, types, vals, "TIMERID = '" + a.decodeFirst(a.valueof("$comp.timers")) + "'" );
a.refresh("$comp.timers");
a.refresh("$comp.Button_ProzessStart");
a.refresh("$comp.Button_ProzessStop");