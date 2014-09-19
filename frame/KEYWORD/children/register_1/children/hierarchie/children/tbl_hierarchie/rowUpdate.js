import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
							[1, "KEYVALUE"],
							[2, "AOACTIVE"],
							[3, "KEYNAME1"],
							[4, "KEYNAME2"],
							[5, "KEYDETAIL"],
							[6, "KEYDESCRIPTION"]
						 ];

var updanz = updtable(fields, row, "KEYWORD", "KEYWORDID");