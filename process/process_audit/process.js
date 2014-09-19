import("lib_loghist");

var tableName   = a.valueof("$local.table");
var dataSetID   = a.valueof("$local.idvalue");
var columnNames = a.valueofObj("$local.columns");
var timestamp	= a.valueofObj("$local.timestamp");
var newvalues	= a.valueofObj("$local.values");
var oldvalues   = a.valueofObj("$local.oldvalues");
var sqlAction   = a.valueof("$local.action");
var userLogin   = a.valueof("$local.user");

//************* Logeinträge  
log_history( tableName, userLogin, columnNames, newvalues, oldvalues, timestamp, sqlAction, dataSetID );
