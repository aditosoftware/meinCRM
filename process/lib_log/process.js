/*
* Eintrag in ErrorLog Tabelle erzeugen
*
* @param {String} pProcess req Name des Prozesses
* @param {String} pDesc req Beschreibung z.B. Exception
* @param {String} pStatus opt Status
* @param {String} pPrio opt Priorität
*
* @return {void}
*/
function ErrorLog(pProcess, pDesc, pStatus, pPrio)
{
    if(pStatus == undefined) pStatus = "";
    if(pPrio == undefined) pPrio = "";
    var spalten = new Array("ERRORLOGID", "PROZESS", "BESCHREIBUNG", "STATUS", "PRIO", "DATE_NEW", "USER_NEW");
    var typen = a.getColumnTypes( "ERRORLOG", spalten);
    var werte = new Array( a.getNewID("ERRORLOG", "ERRORLOGID" ), pProcess, pDesc, pStatus, pPrio, 
        date.date(), "System" );
    a.sqlInsert("ERRORLOG", spalten, typen, werte);
}


/*
* Eintrag in TaskLog Tabelle erzeugen
*
* @param {String} pProcess req Name des Prozesses
* @param {String} pDesc req Beschreibung z.B. Exception
* @param {String} pStatus opt Status
* @param {String} pPrio opt Priorität
*
*
* @return {void}
*/
function TaskLog(pProcess, pDesc, pStatus, pPrio)
{
    if(pStatus == undefined) pStatus = "";
    if(pPrio == undefined) pPrio = "";
    var spalten = new Array("TASKLOGID", "PROZESS", "BESCHREIBUNG", "STATUS", "PRIO", "DATE_NEW", "USER_NEW");
    var typen = a.getColumnTypes( "TASKLOG", spalten);
    var werte = new Array( a.getNewID("TASKLOG", "TASKLOGID" ), pProcess, pDesc, pStatus, pPrio, 
        date.date(), "System" );
    a.sqlInsert("TASKLOG", spalten, typen, werte);
}

/*
* Prüft, ob es sich um einen Serverprozess handelt.
*
* @return {Boolean} true, wenn es sich um einen Serverprozess handelt, sonst false
*/
function isServerProcess()
{
    if ( ! a.hasvar("$sys.clientid")) return true;
    else return false;
}


/*
* LogFile Objekt, welche den zu loggenden String verwaltet.
*
* @return {void}
*/
function LogFileObject()
{
    this.Txt = "";
    this.toLog = function (pStr) {
        this.Txt += pStr + "\n";
        log.log("[LOGFILEWRITER] " + pStr);
    }
} 

/*
* @param {String} pPrefix req Präfix für den Dateinamen. Der Dateiname wird aus dem Präfix und 
* einem Timestamp erstellt. z.B. 20070917093412_Schnittstelle.log
* @param {Date} pStartTime opt Wert für Zeitangabe im Logfilename, wenn nicht angegeben, dann wird 
* er automatisch erzeugt
*
* @return Gibt Dateinamen des aktuellen Logfiles zurück
*/
function getLogFileName(pPrefix, pStartTime)
{
    var isThere = false;
    try  //Prüfen ob pStartTime angegeben wurde
    {
        if(pStartTime.length == 0) isThere = true;
    }catch(ex){}
	
    if(isThere == false)
        pStartTime = a.longToDate(a.valueof("$sys.staticdate"), "yyyy-MM-dd-HHmmss");
		
    return pStartTime + "_" + pPrefix + ".log"; 
}

/*
* @param {String} pLog req Zu loggender String
* @param {String} pPath req Verzeichnis in der das Logfile geschrieben werden soll (ohne Dateiname) z.B. c:/aditoonline/log
* @param {String} pFile req Dateinamen. Am Besten erzeugt mit getLogFileName
*
* @return {Boolean} true wenn allesOK, false wenn Logfile nicht geschrieben werden konnte
*/
function writeLogFile(pLog, pPath, pFile)
{
    var Path;
    //Prüfen ob beim Pfad als letztes Zeichen ein / vorhanden ist
    if(pPath.substr(pPath.length -1 ,1) == "/")
        Path = pPath + pFile;
    else
        Path = pPath + "/" + pFile;
		
    a.globalvar("$global.logfilepath", Path);
	
    if (isServerProcess() == true)
        return fileIO.storeData(Path, pLog, a.DATA_TEXT, false);	
    else
        return 	a.doClientIntermediate(a.CLIENTCMD_STOREDATA, new Array(Path, pLog, a.CLIENTCMD_DATA_TEXT, false));	
}

/*
* gibt MessageTrace zurück (nur wenn es eine Java Exception ist)
* 
* @param {Object} pEx req Die Execption
* 
* @return Exception
*/
function getException(pEx)
{
    var err = "";
    try
    {
        err = pEx.javaException["messageTrace"];
    }
    catch(ex)
    {
        log.log(pEx, log.ERROR);
        err = pEx;
    }
	 
    return err;
}