var timers = 	a.sql("select TIMERID, PROCESSNAME, NEXTSTART, AO_INTERVAL, TIMERSTATE, '' from AOSYS_TIMER", a.SQL_COMPLETE);

for (var i = 0; i < timers.length; i++)
{
    timers[i][1] = a.getDataModels(a.DATAMODEL_KIND_PROCESS, [ timers[i][1] ] )[0][1];
    switch(Number(timers[i][4]))
    {
        case 0 :
            timers[i][4] = "Stopped";
            break;
        case 1 :
            timers[i][4] = "Pending";
            break;
        case 2 :
            timers[i][4] = "Running";
            break;		
    }
    timers[i][5] = a.sql("SELECT LASTRUN FROM ASYS_TIMER WHERE TIMERID LIKE '" + timers[i][0] + "@%'");	
}
a.ro(timers);