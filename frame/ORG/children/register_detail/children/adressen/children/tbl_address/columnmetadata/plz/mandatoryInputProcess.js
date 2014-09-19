var daten = a.valueofObj("$local.rowdata");
var zip = a.sql("select ZIP_EXISTS from COUNTRYINFO where ISO2 = '" + daten[12] + "' ");

a.rs(zip == 'Y' || zip == '');
