/*
* start_timer -- zeitgesteuerte Ausführung von Serverprozessen
* Copyright (c) 2012 ADITO Software GmbH
*/
var StartTimerInterval = 30 * date.ONE_SECOND;
var now = a.valueof("$sys.date");
var lastrun = now - StartTimerInterval;	
var sqlstr = "select TIMERID, PROCESSNAME, NEXTSTART, AO_INTERVAL from AOSYS_TIMER where TIMERSTATE > 0 and NEXTSTART < ?";
var timerdata = a.sql([ sqlstr, [ [ now, SQLTYPES.TIMESTAMP] ] ], a.SQL_COMPLETE);

for (var i = 0; i < timerdata.length; i++)
{
    var timerID = timerdata[i][0];
    var process = timerdata[i][1];
    var nextstart = Number(timerdata[i][2]);
    var interval = Number(timerdata[i][3]) * date.ONE_MINUTE;

    if ( nextstart > lastrun && !a.existsProcessTimer(timerID) )	
    {
        // Timer starten
        a.executeProcessTimer(timerID, process, interval, true, false, a.TIMERTYPE_SERVER, "admin");
    }	
    // Wenn der neue Start vorbei ist, dann nächsten Start setzen	
    if ( interval > 0 )
    {
        while (nextstart < now)		nextstart += interval;
        a.sqlUpdate("AOSYS_TIMER", ["NEXTSTART"], a.getColumnTypes("AOSYS_TIMER", ["NEXTSTART"]), [nextstart], "TIMERID = '" + timerID + "'");
    }
}