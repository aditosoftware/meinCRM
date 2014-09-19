import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
							[1, "ENTRYDATE"],
							[2, "RESPONSIBLE_ID"],
							[3, "DELIVERYDATE"],
							[4, "SENDDATE"],
							[5, "INFO"]
						 ];

var updanz = updtable(fields, row, "SPTENDER", "SPTENDERID");