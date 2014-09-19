import("lib_calendar");

/**
 * Dieser Prozess speichert die im Frame angezeigten Daten
 * Je nach Modus (INSERT, EDIT) wird ein neuer Datensatz angelegt
 * oder der alte editiert
 *
 */
var readonly = getReadOnlyUser();
if ( readonly.length > 0 )
{
    a.showMessage(a.translate("Es besteht keine Schreibberechtigung für folgende Teilnehmer:\n\n") + readonly.join("\n"));
    a.rs( false );
}
else
{
    var wm = a.valueofObj("$sys.workingmode");
    var editmode = (wm == a.FRAMEMODE_NEW ? calendar.MODE_INSERT : calendar.MODE_UPDATE);

    // Zuerst einen Termin zusammenbauen
    var event = a.valueofObj("$image.entry");
    event[calendar.TYPE] = calendar.VEVENT;
    event[calendar.STATUS] = a.valueof("$comp.status");
    event[calendar.SUMMARY] = a.valueofObj("$comp.subject");
    event[calendar.LOCATION] = a.valueofObj("$comp.place");
    event[calendar.DESCRIPTION] = a.valueofObj("$comp.text");
    event[calendar.DTSTART] = a.valueofObj("$comp.start_date");
    event[calendar.DTEND] = a.valueofObj("$comp.end_date");

    var hasReminder = a.valueofObj("$comp.hasreminder");
    if (hasReminder == "true")
    {
        var absolut = event[calendar.REMINDER_ABSOLUT];
        // Absolut nur, wenn auch gesetzt. Default ist relativ
        if (absolut == "true")
        {
            var reminder_date = a.valueofObj("$comp.reminder_date");
            if (reminder_date != null && reminder_date != "")
            {
                event[calendar.HASREMINDER] = "true";
                event[calendar.REMINDER_DATE] = reminder_date;
            }
            else
            {
                event[calendar.HASREMINDER] = "false";
            }
        }
        else
        {
            var reminder_duration = a.valueof("$comp.reminder_duration");
            if (reminder_duration != null && reminder_duration != "")
            {
                event[calendar.HASREMINDER] = "true";
                event[calendar.REMINDER_DURATION] = reminder_duration;
            }
            else
            {
                event[calendar.HASREMINDER] = "false";
            }
        }
    }
    else
    {
        event[calendar.HASREMINDER] = "false";
    }

    event[calendar.CLASSIFICATION] = a.valueofObj("$comp.classification");
    event[calendar.TRANSPARENCY] = a.valueofObj("$comp.transparency");
    
    var affectedusers = a.valueofObj("$image.affectedusers");
    var users = [];
    for ( var i=0; i < affectedusers.length; i++)  
    {
        var login = a.sql("select THEME from THEME where THEMEID = '" + affectedusers[i][0] + "'");
        if(login == undefined || login == "")
        {
            users.push(affectedusers[i][0]);
        }
        else
        {
            users.push(calendar.getCalendarUser(login));
        }
    }
    
    event[calendar.AFFECTEDUSERS] = a.encodeMS(users);
    
    event[calendar.CATEGORIES] = a.valueofObj("$comp.categories");

    calcrecurrence(event);
    if (event[calendar.RRULE] != undefined)
    {
        recurrencend(event);
    }

    //a.showMessage(event[calendar.RRULE]);

    if (event[calendar.DTSTART] == "" || event[calendar.DTSTART] == undefined || event[calendar.DTEND] == "" || event[calendar.DTEND] == undefined)
    {
        a.showMessage(a.translate("Fehler bei den Datumsangaben."));
    }
    else if (event[calendar.HASREMINDER] == "true"
        && (event[calendar.REMINDER_DATE] == "" || event[calendar.REMINDER_DATE] == undefined)
        && (event[calendar.REMINDER_DURATION] == "" || event[calendar.REMINDER_DURATION] == undefined))
    {
        a.showMessage(a.translate("Kein Erinnerungsdatum angegeben."));
    }
    else
    {
        // Links updaten
        a.saveTableEdit("$comp.links");
        // Entweder jetzt neu anlegen oder nur updaten
        if (editmode == calendar.MODE_INSERT)
        {
            try
            {
                var grouptype = a.valueofObj("$comp.grouptype");
                var gt = calendar.GROUP_NONE;
                if (grouptype == "single")
                {
                    gt = calendar.GROUP_SINGLE;
                }
                if (grouptype == "multi")
                {
                    gt = calendar.GROUP_MULTI;
                }

                var ids = calendar.insert(new Array(event), gt);
                event[calendar.ID] = ids[0];
            }
            catch (ex)
            {
                log.log(ex);
                //a.showMessage("Der Termin konnte nicht angelegt werden.");
            }
        }
        else if (editmode == calendar.MODE_UPDATE)
        {
            try
            {
                calendar.updateEntry(event);
            }
            catch (ex)
            {
                log.log(ex);
                //a.showMessage("Der Termin konnte nicht geändert werden.");
            }
        }
        else
        {
            a.showMessage(a.translate("Ungültiger Modus des Frames. Wenden Sie sich an Ihren Administrator"));
        }

        a.imagevar("$image.closecurrentframe", "true");
    }
}

// Liefert die Benutzer zurück, auf die keine Schreibrechte bestehen
function getReadOnlyUser()
{
    var writeable = calendar.getFullCalendarUsers(calendar.RIGHT_WRITE);	
    var affectedusers = a.valueofObj("$image.affectedusers");
    var users = [];
    for ( var i=0; i < affectedusers.length; i++)  
    {
        var login = a.sql("select THEME from THEME where THEMEID = '" + affectedusers[i][0] + "'");
        if(login == undefined || login == "")
        {
            users.push(affectedusers[i][0]);
        }
        else
        {
            users.push(calendar.getCalendarUser(login));
        }
    }
	
    var readonly = new Array();

    for (var i = 0; i < users.length; i++)
    {
        var user = users[i];
        if (!isWriteable(user, writeable))
        {
            readonly.push(a.decodeMS(user)[1].substring(3));
        }
    }
	
    return readonly;	
}

// Liefert TRUE, wenn der Benutzer bei denen mit Schreibberechtigungen enthalten ist
function isWriteable(user, writeable)
{
    for (var i = 0; i < writeable.length; i++)
    {
        if (writeable[i][0] == user)		
            return true;
    }
	
    return false;
}

// Berechnet das Ende der Recurrence
function recurrencend(event)
{
    var rec_end = a.valueof("$comp.rec_end");

    // Automatische Erkennung, was gewollt ist
    if (rec_end == "")
    {
        if (a.valueofObj("$comp.rec_end_count") != "")
            rec_end = "Endet nach Anzahl Terminen";
        else if (a.valueofObj("$comp.rec_end_date") != "")
            rec_end = "Endet am";
    }

    if (rec_end == "" || rec_end == "Kein Enddatum")
    {
        // Nichts
    }
    else if (rec_end == "Endet nach Anzahl Terminen")
    {
        event[calendar.RRULE][0] += (";COUNT=" + a.valueofObj("$comp.rec_end_count"));
    }
    else if (rec_end == "Endet am")
    {
        var dat = a.valueofObj("$comp.rec_end_date");
        var start = a.valueofObj("$comp.start_date");
        var localTime = date.longToDate(dat, "yyyyMMdd") + date.longToDate(start, "HHmmss");
        var utcTime = date.dateToLong(localTime, "yyyyMMddHHmmss");
        event[calendar.RRULE][0] += (";UNTIL=" + date.longToDate(utcTime, "yyyyMMdd\'T\'HHmmss\'Z\'", "UTC"));
    }

}

/**
 * Berechnet die Wiederholung
 *
 * @param event Das fertige Event. Hier die Reccurrence speichern
 */
function calcrecurrence(event)
{
    var rec_type = a.valueofObj("$comp.rec_type");

    if (rec_type == "")
    {
        // Nichts
    }
    else if (rec_type == "Keine")
    {
    }
    else if (rec_type == "Täglich")
    {
        rec_daily(event);
    }
    else if (rec_type == "Wöchentlich")
    {
        rec_weekly(event);
    }
    else if (rec_type == "Monatlich")
    {
        rec_monthly(event);
    }
    else if (rec_type == "Jährlich")
    {
        rec_yearly(event);
    }
    else
    {
        a.showMessage("Internal (1) " + rec_type);
    }
}
/***********************/
function rec_yearly(event)
{
    var rec_year = a.valueofObj("$comp.rec_yearly");
    var month;
    var day;

    if (rec_year == "")
    {
        if (a.valueofObj("$comp.rec_yearly_month") != "" && a.valueofObj("$comp.rec_yearly_day") != "")
            rec_year = "Jeden # #";
        else if (a.valueofObj("$comp.rec_yearly_month2") != "" && a.valueofObj("$comp.rec_yearly_day2") != "" && a.valueofObj("$comp.rec_yearly_number2") != "")
            rec_year = "Am #. # im #";
    }

    if (rec_year == "")
    {
        a.showMessage(a.translate("Jährliche Serie nicht genauer spezifiziert. Ignoriere Serie."));
    }
    else if (rec_year == "Jeden # #")
    {
        month = a.valueofObj("$comp.rec_yearly_month");
        day = a.valueofObj("$comp.rec_yearly_day");
        event[calendar.RRULE] = new Array("FREQ=YEARLY;BYMONTHDAY="+day+";BYMONTH="+month);
    }
    else if (rec_year == "Am #. # im #")
    {
        month = a.valueofObj("$comp.rec_yearly_month2");
        day = a.valueofObj("$comp.rec_yearly_day2");
        var number = a.valueofObj("$comp.rec_yearly_number2");
        event[calendar.RRULE] = new Array("FREQ=YEARLY;BYMONTH="+month+";BYDAY="+number+day);
    }
}
/***********************/
function rec_monthly(event)
{
    var rec_month = a.valueofObj("$comp.rec_month");
    var day;
    var interval;

    if (rec_month == "")

    {
        if (a.valueofObj("$comp.rec_monthly_day") != "" && a.valueofObj("$comp.rec_monthly_interval") != "")
            rec_month = "Am #. jedes #. Monat";
        else if (a.valueofObj("$comp.rec_monthly_day2") != "" && a.valueofObj("$comp.rec_monthly_interval2") != "" && a.valueofObj("$comp.rec_monthly_weekday2") != "")
            rec_month = "Am #. # jeden #. Monat";
    }

    if (rec_month == "")
    {
        a.showMessage(a.translate("Monatliche Serie nicht genauer spezifiziert. Ignoriere Serie."));
    }
    else if (rec_month == "Am #. jedes #. Monat")
    {
        day = a.valueofObj("$comp.rec_monthly_day");
        interval = a.valueofObj("$comp.rec_monthly_interval");
        event[calendar.RRULE] = new Array("FREQ=MONTHLY;INTERVAL=" + interval + ";BYMONTHDAY=" + day);
    }
    else if(rec_month == "Am #. # jeden #. Monat")
    {
        day = a.valueofObj("$comp.rec_monthly_day2");
        interval = a.valueofObj("$comp.rec_monthly_interval2");
        var weekday = a.valueofObj("$comp.rec_monthly_weekday2");
        event[calendar.RRULE] = new Array("FREQ=MONTHLY;INTERVAL=" + interval + ";BYDAY=" + day + weekday);
    }
}
/***********************/
function rec_weekly(event)
{

    var rec_weekly_intervall = a.valueofObj("$comp.rec_weekly_intervall");
    if (rec_weekly_intervall == "")
        rec_weekly_intervall = "1";

    var days = new Array();
    var count = 0;
    if (a.valueofObj("$comp.rec_weekly_mo") == "true")
    {
        days[count] = "MO";
        count++;
    }
    if (a.valueofObj("$comp.rec_weekly_di") == "true")
    {
        days[count] = "TU";
        count++;
    }
    if (a.valueofObj("$comp.rec_weekly_mi") == "true")
    {
        days[count] = "WE";
        count++;
    }
    if (a.valueofObj("$comp.rec_weekly_do") == "true")
    {
        days[count] = "TH";
        count++;
    }
    if (a.valueofObj("$comp.rec_weekly_fr") == "true")
    {
        days[count] = "FR";
        count++;
    }
    if (a.valueofObj("$comp.rec_weekly_sa") == "true")
    {
        days[count] = "SA";
        count++;
    }
    if (a.valueofObj("$comp.rec_weekly_so") == "true")
    {
        days[count] = "SU";
        count++;
    }
    if (count > 0)
    {
        event[calendar.RRULE] = new Array("FREQ=WEEKLY;INTERVAL=" + rec_weekly_intervall + ";WKST=MO;BYDAY=");
        for (var i = 0; i < count; i++)
        {
            event[calendar.RRULE][0] += days[i];
            if (i+1 < count)
            {
                event[calendar.RRULE][0] += ",";
            }
        }
    }
}
/***********************/
function rec_daily(event)
{
    var rec_dailytype = a.valueofObj("$comp.rec_dailytype");

    if (rec_dailytype == "")
    {
        if (a.valueofObj("$comp.rec_daily_days") != "")
            rec_dailytype = "Alle # Tage";
    }

    if (rec_dailytype == "")
    {
        a.showMessage(a.translate("Tägliche Serie nicht genauer spezifiziert. Ignoriere Serie."));
    }
    else if (rec_dailytype == "Alle # Tage")
    {
        event[calendar.RRULE] = new Array("FREQ=DAILY;INTERVAL=" + a.valueofObj("$comp.rec_daily_days"));
    }
    else if (rec_dailytype == "Jeden Arbeitstag")
    {
        event[calendar.RRULE][0] = new Array("FREQ=WEEKLY;WKST=MO;BYDAY=MO,TU,WE,TH,FR");
    }
    else
    {
        a.showMessage(a.translate("Internal (2)") + " " + rec_dailytype);
    }
}
