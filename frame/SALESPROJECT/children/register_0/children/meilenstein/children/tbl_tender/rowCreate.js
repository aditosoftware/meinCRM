import("lib_tablecomp");

var row = a.valueofObj("$local.rowdata");

var fields = [
							[1, "ENTRYDATE"],
							[2, "RESPONSIBLE_ID"],
							[3, "DELIVERYDATE"],
							[4, "SENDDATE"],
							[5, "INFO"]
						 ];

var vkfields = [[a.valueof("$comp.idcolumn"), "SALESPROJECT_ID"]];
var updanz = instable(fields, vkfields, row, "SPTENDER", "SPTENDERID");