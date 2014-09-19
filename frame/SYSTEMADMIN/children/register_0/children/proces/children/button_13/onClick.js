import("lib_timer")

/*
	2006-12-07-ah vor dem ausfuehren nochmals testen, ob der prozess auch wirklich gestoppt ist
	2008-07-02-ah umgebaut, um prozesse sowohl auf dem client als auch auf dem server starten zu können 
*/
var process = a.valueof("$comp.comboManual");
var runat = a.valueof("$comp.comboRunAt").toLowerCase();

if(process != "")
{
    var stopped = a.sql("select count(*) from AOSYS_TIMER where TIMERSTATE > 0 and PROCESSNAME = '" + process + "'") == 0;
    if(stopped)
    {
        if(runat == "s") // auf Server ausführen
        {
            var theID = "manualrun_" + a.getNewUUID();
            a.executeProcessTimer(theID, process, 0, true, false, a.TIMERTYPE_SERVER_RUN, "Admin");
            a.stopProcessTimer(theID);
            a.showMessage("Prozess gestartet, bitte Serverlog kontrollieren.");
        }
        else if(runat == "c") // auf Client ausführen
        {
            var res = a.executeProcess(process);
            if ( res != null ) a.showMessage(res);
        }
    }
    else
    {
        a.showMessage("Der ausgewählte Prozess ist nicht gestoppt.\nProzess kann manuell nicht ausgeführt werden.");
    }
}