var timers = 	a.sql("select TIMERID, PROCESSNAME, NEXTSTART, AO_INTERVAL, TIMERSTATE, 0 from AOSYS_TIMER", a.SQL_COMPLETE);
a.ro(timers);