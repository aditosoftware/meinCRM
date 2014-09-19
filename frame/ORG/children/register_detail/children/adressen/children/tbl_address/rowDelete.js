// Personen, die die gelöschte Adresse als Standardadresse eingetragen haben, 
// können nicht mehr angezeigt werden. Hier werden die Adressen auf die Standardadresse der Firma gesetzt.
var tableName = "RELATION";
var columns = ["ADDRESS_ID"];
var columnTypes = a.getColumnTypes(tableName, columns);
var values = a.valueof("$comp.ADDRESS_ID");
var condition = "ADDRESS_ID = '" + a.valueof("$local.idvalue") + "' and PERS_ID IS NOT NULL";

// Aktualisiere Datensätze, die diese Adresse als Standardadresse haben
a.sqlUpdate(tableName, columns, columnTypes, [values], condition);

a.sqlDelete("ADDRESS", "ADDRESSID = '" + a.valueof("$local.idvalue") + "'");