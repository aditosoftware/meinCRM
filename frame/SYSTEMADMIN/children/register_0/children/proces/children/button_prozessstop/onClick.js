var timerID = a.decodeFirst(a.valueof("$comp.timers"));
a.sqlUpdate("AOSYS_TIMER", ["TIMERSTATE"], a.getColumnTypes("AOSYS_TIMER", ["TIMERSTATE"]), ["0"], "TIMERID = '" + timerID + "'");    
if (a.existsProcessTimer(timerID))	a.stopProcessTimer(timerID);
a.refresh("$comp.timers");
a.refresh("$comp.Button_ProzessStart");
a.refresh("$comp.Button_ProzessStop");