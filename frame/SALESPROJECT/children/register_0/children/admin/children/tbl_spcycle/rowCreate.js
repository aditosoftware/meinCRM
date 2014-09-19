import("lib_tablecomp");

var id = a.valueof("$comp.idcolumn");
var row = a.valueofObj("$local.rowdata");

var fields = [
							[1, "ENTRYDATE"],
							[2, "STATUSPHASE"],
							[3, "KEYVAL"]
						 ];

var vkfields = [[id, "SALESPROJECT_ID"]];
var updanz = instable(fields, vkfields, row, "SPCYCLE", "SPCYCLEID");