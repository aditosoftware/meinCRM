/*
	
	* Initialisiert die Timer. Muss in der serverautostart aufgerufen werden
	*
	* @return {void}
*/
function initTimers()
{	
    a.executeProcessTimer("PENDING_TIMER_STARTER", "start_timer", date.ONE_SECOND * 30, true, false, a.TIMERTYPE_SERVER);	
}

/*
* muss von jedem Timerprozess beim Start ausgeführt werden
*
* @param {String} pProcess req Prozessname
*
* @return {void}
*/
function timerProcessStartup(pProcess)
{
    updateTimer( pProcess, "TIMERSTATE", 2);
}

/*
* muss von jedem Timerprozess beim Ende ausgeführt werden
*
* @param {String} pProcess req Prozessname
* @param {[]} pExitCode req Exit Code des Timers
* 
* @return {void}
*/
function timerProcessShutdown(pProcess, pExitCode)
{
    updateTimer(pProcess, "TIMERSTATE", 1);
    updateTimer(pProcess, "EXITCODE", pExitCode);
}

/*
* setzt den ausfuehrungsstatus eines prozesses
*
* @param {String} pProcess req Prozessname
* @param {String} pColumn req Spalten
* @param {String} pValue req Werte
*
* @return {void}
*/
function updateTimer(pProcess, pColumn, pValue)
{
    var types = a.getColumnTypes("AOSYS_TIMER", [pColumn]);
    a.sqlUpdate("AOSYS_TIMER", [pColumn], types, [pValue], "PROCESSNAME = '" + pProcess + "'");
}