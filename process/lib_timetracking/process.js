import("lib_history");
import("lib_keyword");
import("lib_sql");
import("lib_frame");

/*
* Eintrag der Bearbeitungszeit für ein Ticket
*
* @param {char} pObjectID req 
* @param {char} pRowID req 
*
* return {void}
*/
function InsertTime( pObjectID, pRowID )
{
    var user = a.valueof("$sys.user");
    var acttime = a.valueof("$sys.date");
    var fields = ["TIMETRACKINGID", "OBJECT_ID",  "ROW_ID", "RELATION_ID", "MINUTES", "TRACKINGDATE", "DESCRIPTION", "DATE_NEW", "USER_NEW"];
    var types = a.getColumnTypes("TIMETRACKING", fields);
    var cancelled = false;
    // definition der pflichtfelder
    var mandatory = [ ["DLG_TICKETTIME.TimeMin", a.translate("Minuten") ] ];

    var checkMandatory = [];  // enthält später ein string-array mit den namen der nicht gefüllten pflichtfelder
    var missingMandatory = true; // variable, die angibt, ob noch pflichtfelder leer sind
    a.localvar("$local.TimeDate", a.valueof("$sys.date"));
    a.localvar("$local.TimeMA", a.valueof("$global.user_relationid"));	   		
    // Pflichtfelder abfragen
    while(!cancelled && missingMandatory)
    {
        var ergebnis = a.askUserQuestion(a.translate("Zeiterfassung"), "DLG_TICKETTIME");
        if (ergebnis == null)
        {
            cancelled = true;
        }
        else
        { 
            // Pflichtfelder abfragen
            checkMandatory = checkMandatoryFields(mandatory, ergebnis);
            missingMandatory = (checkMandatory.length > 0);
            if(missingMandatory )
            {
                a.showMessage(a.translate("Folgende Pflichtfelder wurde noch nicht gefüllt:") + "\n\n" + 	checkMandatory.join("\n"));
            }
            var timemin = getTimeMin( ergebnis["DLG_TICKETTIME.TimeMin"] );
            if ( timemin == "") missingMandatory = true;
            a.localvar("$local.TimeDate", ergebnis["DLG_TICKETTIME.TimeDate"]);
            a.localvar("$local.TimeMA", ergebnis["DLG_TICKETTIME.TimeMA"]);
            a.localvar("$local.TimeMin", timemin);
            a.localvar("$local.TimeDescription", ergebnis["DLG_TICKETTIME.TimeDescription"]);
        }
    }

    if (!cancelled)
    {	
        var dvalues = [a.getNewUUID(), pObjectID, pRowID, a.valueof("$local.TimeMA"), timemin, a.valueof("$local.TimeDate"), a.valueof("$local.TimeDescription"), acttime, user];
        a.sqlInsert( "TIMETRACKING", fields, types, dvalues );
    }
}

/*
* Startet die Bearbeitungszeit für ein Ticket
*
* @param {char} pObjectID req 
* @param {char} pRowID req 
*
* return {void}
*/
function StartTime( pObjectID, pRowID )
{
    var user = a.valueof("$sys.user");
    var acttime = a.valueof("$sys.date");
    var relationid = a.valueof("$global.user_relationid");

    if (pObjectID == 45)
    {
        var ticket = a.sql("select TIMETRACKINGID, ROW_ID, TICKETCODE "
            + " from TIMETRACKING join SUPPORTTICKET on ROW_ID = SUPPORTTICKETID and OBJECT_ID = 45 "
            + " where MINUTES is null and TIMETRACKING.RELATION_ID = '" + relationid + "' and ROW_ID != '" + pRowID + "'", a.SQL_ROW);
			
        if (ticket.length > 0)
        {
            a.showMessage(a.translate("TicketHistory zu Ticket '%0' \nmuss zuerst geschlossen werden !", [ticket[2]]));
            a.openFrame("SUPPORTTICKET", "SUPPORTTICKETID = '" + ticket[1] + "'", false, a.FRAMEMODE_SHOW)
        }
        else
        {
            var col = ["TIMETRACKINGID", "OBJECT_ID", "ROW_ID", "RELATION_ID", "TRACKINGDATE", "DATE_NEW", "USER_NEW"];
            var typ = a.getColumnTypes("TIMETRACKING", col);
            var val = [a.getNewUUID(), pObjectID, pRowID, relationid, acttime, acttime, user];
            a.sqlInsert( "TIMETRACKING", col, typ, val );
            a.refresh();
        }
    }
}

/*
* Stopt die Bearbeitungszeit für die Zeiterfassung
*
* @param {char} pObjectID req 
* @param {char} pRowID req 
*
* return {void}
*/
function StopTime( pObjectID, pRowID )
{
    var del = false;
    var relationid = a.valueof("$global.user_relationid");
	
    if (pObjectID == 45)
    {
        var ticket = a.sql("select TIMETRACKINGID, TRACKINGDATE, TICKETCODE, TITLE "
            + " from TIMETRACKING join SUPPORTTICKET on ROW_ID = SUPPORTTICKETID and OBJECT_ID = 45 "
            + " where MINUTES is null and TIMETRACKING.RELATION_ID = '" + relationid + "' and ROW_ID = '" + pRowID + "'", a.SQL_ROW);
        if (ticket.length > 0)
        {
            do
            {
                del = false;
                var minutes = eMath.roundInt( ( a.valueof("$sys.date") - ticket[1] ) / date.ONE_MINUTE, eMath.ROUND_UP ); 
                var min = "0" + (minutes % 60);
                a.localvar("$local.Minutes", eMath.roundInt(minutes / 60, eMath.ROUND_DOWN) + ":" + min.substr( min.length - 2, 2));
                var ergebnis = a.askUserQuestion( a.translate("Ticket: %0\nTitel: %1\nStartzeit: %2", [ticket[2] ,ticket[3], date.longToDate(ticket[1],"dd.MM.yyyy HH:mm") ]), "DLG_TICKETTIME_STOP");
                if ( ergebnis != null )
                {
                    var timecorrection = ergebnis["DLG_TICKETTIME_STOP.Correction"];
                    if ( timecorrection != "" )	minutes = eMath.addInt( minutes, timecorrection ); 
                    if ( minutes < 5 || minutes > 600 )
                    {
                        var message = a.translate("Dauer: %0 min\nDauer darf nicht kleiner %1 und nicht größer %2 sein."
                            + "\nSoll die Zeiterfassung gelöscht werden ? ", [ minutes, "5 Min.", "10 Std." ])	
                        del = a.askQuestion(message, a.QUESTION_YESNO, "");
                    }
                }
            } while( del == "false" && ergebnis != null);
				
            if ( del == "true") 
            {
                a.sqlDelete("TIMETRACKING", "TIMETRACKINGID = '" + ticket[0] + "'" );
                a.refresh();
            }
            else
            if (ergebnis != null)
            {	
                var col = ["MINUTES", "DESCRIPTION"];
                var typ = a.getColumnTypes("TIMETRACKING", col);
                var val = [ minutes, ergebnis["DLG_TICKETTIME_STOP.TimeDescription"] ];
                a.sqlUpdate("TIMETRACKING", col, typ, val, "TIMETRACKINGID = '" + ticket[0] + "'" );
					
                a.refresh();
            }
        }
    }
}

/*
* Bearbeitungszeit gestarted ?
*
* @param {char} pRowID req 
*
* return {boolean}
*/
function isStarted( pRowID )
{
    return ( a.sql("select count(*) from TIMETRACKING where MINUTES is null and RELATION_ID = '" 
        + a.valueof("$global.user_relationid") + "' and ROW_ID = '" + pRowID + "'") > 0 );
}

/*
* gibt die eingegebene Zeit in Min zurück
*
* @param {String} pTime req Zeit in Min oder Std
*
* @return {String} bereinigter Projektname
*/
function getTimeMin( pTime )
{
    var totalmins = false;
    var ok = true;
    if(pTime.length > 5)	ok = false;
    else
    {
        // feststellen, was der benutzer eingegeben hat,
        // xx:yy oder zzz 
        var wo = pTime.indexOf(":");
        if(wo > 0)
        {
            // eingabe mit doppelpunkt ist eine angabe hh:mm
            var hrs = pTime.substr(0, wo);
            var min = pTime.substr(wo+1, 2);
            hrs = Number(hrs);
            min = Number(min);
        }
        else
        {
            // eingabe einer ganzen zahl bedeutet minuten
            min = Number(pTime);
            hrs = (min - (min % 60)) / 60;
            min = min - hrs * 60;
        }
		
        // prüfen auf gültigen bereich
        if((hrs.toString() == "NaN") || (hrs < 0 || hrs > 23)) ok = false;
        if((min.toString() == "NaN") || (min < 0 || min > 59)) ok = false;
    }

    if(ok == false)
    {
        a.showMessage("Die Eingabe [" + pTime + "] ist keine gültige Zeitspanne.\nBitte korrigieren Sie die Eingabe");
        totalmins = "";
    }
    else
    {
        totalmins = (hrs * 60 ) + min;
    }
    return totalmins;
}