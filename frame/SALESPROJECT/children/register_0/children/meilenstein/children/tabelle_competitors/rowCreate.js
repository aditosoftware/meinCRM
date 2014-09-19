import("lib_tablecomp");

var id = a.valueof("$comp.idcolumn");
var row = a.valueofObj("$local.rowdata");

var fields = [
							[2, "ORGNAME"],
							[3, "STATUS"],
							[4, "DATECANCELLED"],
							[5, "REASON"],
							[6, "INFO"]
						 ];

var vkfields = [[a.valueof("$comp.SALESPROJECTID"), "SALESPROJECT_ID"]];
var updanz = instable(fields, vkfields, row, "SPCOMPETITION", "SPCOMPETITIONID");