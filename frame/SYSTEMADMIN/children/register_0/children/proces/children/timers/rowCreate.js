var row = a.valueofObj("$local.rowdata");
var cols = ["TIMERID", "PROCESSNAME", "NEXTSTART", "AO_INTERVAL", "TIMERSTATE"];
a.sqlInsert("AOSYS_TIMER", cols, a.getColumnTypes("AOSYS_TIMER", cols), ["_TIMER__" + row[1], row[1], row[2], row[3], "0"]);