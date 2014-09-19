import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
							[1, "GROUPCODEID"],
							[2, "STARTDATE"],
							[3, "VOLUME"],
							[4, "INFO"]
						 ];

var updanz = updtable(fields, row, "SPFORECAST", "SPFORECASTID");