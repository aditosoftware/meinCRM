var daten = a.valueofObj("$local.rowdata");
var zip = a.sql("select ZIP_EXISTS from COUNTRYINFO where ISO2 = '" + daten[14] + "' ");

a.rs(zip == 'Y' || zip == '' && a.valueof("$comp.relationid") == daten[3]);