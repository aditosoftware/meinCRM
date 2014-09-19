import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
							[1, "ENTRYDATE"],
							[2, "SOURCE"],
							[3, "INFO"]
						 ];

var updanz = updtable(fields, row, "SPSOURCES", "SPSOURCESID");