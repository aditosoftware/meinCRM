/**
 * Dieser Prozess speichert die im Frame angezeigten Daten
 * Je nach Modus (INSERT, EDIT) wird ein neuer Datensatz angelegt
 * oder der alte editiert
 */

var val = parseInt(a.valueof("$comp.percent"), 10);
if ( val < 0 || val > 100 || val.toString() == 'NaN') 
{
    a.showMessage("Es wurde ein ungültiger Wert in erledigt gesetzt.\nDer Wert muss zwischen 0 und 100 liegen !")
    a.rs(false)
}
else
{
    var wm = a.valueofObj("$sys.workingmode");
    var editmode = (wm == a.FRAMEMODE_NEW ? calendar.MODE_INSERT : calendar.MODE_UPDATE);

    // Zuerst einen Termin zusammenbauen
    var event = a.valueofObj("$image.entry");
    event[calendar.TYPE] = calendar.VTODO;
    event[calendar.SUMMARY] = a.valueofObj("$comp.subject");
    event[calendar.DUE] = a.valueofObj("$comp.due_date");
    event[calendar.DTSTART] = a.valueofObj("$comp.startdate");
    event[calendar.DESCRIPTION] = a.valueofObj("$comp.text");

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
    event[calendar.STATUS] = a.valueofObj("$comp.status");
    event[calendar.PERCENT] = a.valueofObj("$comp.percent");
    event[calendar.PRIORITY] = a.valueofObj("$comp.priority");
    event[calendar.CLASSIFICATION] = a.valueofObj("$comp.classification");
    
    event[calendar.CATEGORIES] = a.valueofObj("$comp.categories");
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
        
    
    if (event[calendar.HASREMINDER] == "true"
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
                    //event[calendar.USER] = a.encodeMS(users);
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
            }
        }
        else if (editmode == calendar.MODE_UPDATE)
        {
            try
            {
                calendar.update(new Array(event));
            }
            catch (ex)
            {
                log.log(ex);
            }
        }
        else
        {
            a.showMessage(a.translate("Ungültiger Modus des Frames. Wenden Sie sich an Ihren Administrator"));
        }
        a.imagevar("$image.closecurrentframe", "true");
    }
}
