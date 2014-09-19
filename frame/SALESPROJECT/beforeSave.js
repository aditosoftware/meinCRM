import("lib_attr");

// min und max Attribute überprüfen
var ret = checkAttrCount();
if ( ret )
{
    // Eintrag Herkunft prüfen, muss mindesetns einen Eintrag (Initialeintrag) haben
    var data = a.getTableData("$comp.tbl_sources",a.ALL);
    if (data.length == 0)
    {
        a.setFocus("$comp.tbl_sources");
        a.showMessage("Bitte Herkunft eintragen !");
        ret = false;
    }
    else ret = true;
}

if ( ret )
{
    //Prüfen, da sonst Objekt-Nummer mehrfach vergeben wird.
    var maxval = eMath.addInt(a.sql("select max(PROJECTNUMBER) from SALESPROJECT"),"1");
    if(maxval > a.valueof("$comp.PROJECTNUMBER"))  a.setValue("$comp.PROJECTNUMBER", maxval);

    // SPCYCLE setzen
    var id = a.valueof("$comp.idcolumn");
    var status = a.valueof("$comp.STATUS");
    var phase = a.valueof("$comp.PHASE");
    var colins = ["SPCYCLEID", "SALESPROJECT_ID", "ENTRYDATE", "STATUSPHASE", "KEYVAL", "DAYS", "DATE_NEW", "USER_NEW"];
    var typins = a.getColumnTypes("SPCYCLE", colins);
    var colupd = ["DAYS", "DATE_NEW", "USER_NEW"];
    var typupd = a.getColumnTypes("SPCYCLE", colupd);
    var today = a.valueof("$sys.today");
    var user = a.valueof("$sys.user");
    if (a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW) // Neuanlage
    {
        a.sqlInsert("SPCYCLE", colins, typins, [a.getNewUUID(), id, today, 'Status', status, 0, today, user]);
        a.sqlInsert("SPCYCLE", colins, typins, [a.getNewUUID(), id, today, 'Phase', phase, 0, today, user]);
    }
    else // Editieren
    {
        var statusold = a.sql("select KEYVAL, SPCYCLEID, ENTRYDATE from SPCYCLE where SALESPROJECT_ID = '" + id + "' and STATUSPHASE = 'Status' order by ENTRYDATE desc", a.SQL_ROW);
        var phaseold = a.sql("select KEYVAL, SPCYCLEID, ENTRYDATE from SPCYCLE where SALESPROJECT_ID = '" + id + "' and STATUSPHASE = 'Phase' order by ENTRYDATE desc", a.SQL_ROW);
        var statusdiff = eMath.roundInt((today - statusold[2])/date.ONE_DAY, 0);
        var phasediff = eMath.roundInt((today - phaseold[2])/date.ONE_DAY, 0);
        // Status aktualisieren
        if (statusold[0] != status) // bei Statusänderung
        {
            a.sqlInsert("SPCYCLE", colins, typins, [a.getNewUUID(), id, today, 'Status', status, 0, today, user]);
            a.sqlUpdate("SPCYCLE", colupd, typupd, [statusdiff, today, user], " SPCYCLEID = '" + statusold[1] + "'");
        }
        else // bei Status unverändert und nicht Abgebrochen, Auftrag, Verloren : nur Tage aktualisieren
        if (status != 3 && status != 5 && status != 6)
            a.sqlUpdate("SPCYCLE", colupd, typupd, [statusdiff, today, user], " SPCYCLEID = '" + statusold[1] + "'");
        // Phase aktualisieren
        if (phaseold[0] != phase) // bei Phasenänderung
        {
            a.sqlInsert("SPCYCLE", colins, typins, [a.getNewUUID(), id, today, 'Phase', phase, 0, today, user]);
            a.sqlUpdate("SPCYCLE", colupd, typupd, [phasediff, today, user], " SPCYCLEID = '" + phaseold[1] + "'");
        }
        else // bei Phase unverändert nur Tage aktualisieren
            a.sqlUpdate("SPCYCLE", colupd, typupd, [phasediff, today, user], " SPCYCLEID = '" + phaseold[1] + "'");
    }

    // Forecast löschen wenn Status Vertagt, Abgebrochen oder Verloren ist
    if ( a.valueof("$comp.STATUS") == "2" || a.valueof("$comp.STATUS") == "3" || a.valueof("$comp.STATUS") == "6")
    {
        a.sqlDelete("SPFORECAST", "SALESPROJECT_ID = '" + id + "'");
        a.showMessage("Forecast wurde gelöscht !");
    }
}
a.rs(ret);