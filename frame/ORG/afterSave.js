import("lib_linkedFrame");

// Personen mit gelöschter Standardadresse können nicht mehr angezeigt werden.
// Hier erhalten sie die Standardadresse der Firma
if(a.hasvar("$image.standardadresse"))
{
    if(a.valueof("$image.standardadresse") != a.valueof("$comp.ADDRESS_ID"))
    { // Wenn Standardadresse geändert wurde
        var tableName = "RELATION";
        var columns = ["ADDRESS_ID"];
        var columnTypes = a.getColumnTypes(tableName, columns);
        var values = a.valueof("$comp.ADDRESS_ID");
        var condition = "ADDRESS_ID = '" + a.valueof("$image.standardadresse") + "' AND PERS_ID IS NOT NULL";
        // Abhängige Datensätze aktualisieren
        a.sqlUpdate(tableName, columns, columnTypes, [values], condition);
        
    }
}

a.refresh("$comp.Label_orgaddress");

// Schliessen, Speichern, Aktualisieren von Superframe
swreturn();

