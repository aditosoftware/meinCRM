import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");
var keytype = a.valueof("$comp.keyvalue");

var fields = [
							[1, "KEYVALUE"],
							[2, "AOACTIVE"],
							[3, "KEYNAME1"],
							[4, "KEYNAME2"],
							[5, "KEYDETAIL"],
							[6, "KEYDESCRIPTION"]
						 ];
var vkfields = [[ keytype, "KEYTYPE"], [row[1], "KEYSORT"]];
var updanz = instable(fields, vkfields, row, "KEYWORD", "KEYWORDID");