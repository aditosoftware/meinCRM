import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
							[1, "ENTRYDATE"],
							[2, "STATUSPHASE"],
							[3, "KEYVAL"]
						 ];

var updanz = updtable(fields, row, "SPCYCLE", "SPCYCLEID");